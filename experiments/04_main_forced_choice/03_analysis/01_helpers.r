## this file provides helper functions

library(tidyverse)

## ******************************
## set some global variables ----
## ******************************

theta_arg <- 0.8

## ****************************
## load & precprocess data ----
## ****************************

# load data & fix naming error
d = read_csv('../02_data/data_raw.csv') %>% 
  # fix typo in column head
  rename(situation_number = sitation_number) %>% 
  filter(trial_name != "training_trials")

## ******************************
## all sentences & situation ----
## ******************************

# all relevant sentences 
sentences <- expand.grid(
  outer = c("all", "some", "most", "none"),
  inner = c("all", "some", "most", "none"),
  predicate = c("wrong", "right")
) %>% 
  mutate(
    compact = str_c(outer, "|", inner, "|", predicate)
  ) %>% pull(compact)

# all relevant situations
situations <- d %>% 
  select(situation_number, stimulus) %>% 
  unique %>% 
  arrange(situation_number)

## ***************
## clean data ----
## ***************

# check for incomplete responses
message(
  "There were ", 
  d %>% filter(! response %in% sentences) %>% nrow(),
  " trials which were excluded because they were recorded incompletely (due to a technical issue)."
)

# remove incompletely recorded trials
d = d %>% filter(response %in% sentences)

## *****************************
## semantics of expressions ----
## *****************************

evaluate_quantifier = function(quantifier, bool_vector) {
  case_when(
    quantifier == "all"  ~ sum(bool_vector) == length(bool_vector),
    quantifier == "some" ~ sum(bool_vector) >= 1,
    quantifier == "many" ~ sum(bool_vector) > 0.3 * length(bool_vector),
    quantifier == "most" ~ sum(bool_vector) > 0.5 * length(bool_vector),
    quantifier == "none" ~ sum(bool_vector) == 0,
    quantifier == "few"  ~ sum(bool_vector) <= 0.3 * length(bool_vector)
  )
}

evaluate_predicate = function(resp, stimulus){
  if (resp[3] == "wrong") {
    return(1 - stimulus)
  } 
  else {
    return(stimulus)
  }
}

evaluate_truth = function(resp, stimulus) {
  resp = resp %>% str_split("\\|", simplify = F) %>% unlist()
  stimulus = evaluate_predicate(resp, stimulus)
  stimulus = map_dbl(
    1:nrow(stimulus), 
    function(i) {
      evaluate_quantifier(resp[2], stimulus[i,])  
    }
  )
  evaluate_quantifier(resp[1], stimulus)
}

# all relevant situations
situations <- d %>% 
  select(situation_number, stimulus) %>% 
  unique %>% 
  arrange(situation_number)

# extract the situation (string) that goes with a situation number
get_stimulus_for_situation_number <- function(s_nr) {
  filter(situations, situation_number == s_nr) %>% pull(stimulus)
}

get_truth_value = Vectorize(function(sentence, situation_number) {
  # extract stimulus representation for the situation_numer
  stimulus <- get_stimulus_for_situation_number(situation_number)
  # preprocess stimulus representation
  stimulus = stimulus %>% str_split("\\|", simplify = F) %>% unlist()
  stimulus = stimulus %>% as.numeric() %>% matrix(byrow = T, ncol = 12)
  # stimulus = 1 - stimulus # why do I need this?
  evaluate_truth(sentence, stimulus)
})

## *******************************
## probability of expressions ----
## *******************************

# calculate the probability that a single quantifier
# statement is true for a given bias and number of observations
calculate_probability_quantifier = function(quantifier, bias, n_observations) {
  case_when(
    quantifier == "all"  ~ dbinom(x= n_observations, size = n_observations, prob = bias) %>% sum,
    quantifier == "some" ~ dbinom(x= 1:n_observations, size = n_observations, prob = bias) %>% sum,
    quantifier == "many" ~ dbinom(x= ceiling(0.3*n_observations):n_observations, size = n_observations, prob = bias) %>% sum,
    quantifier == "most" ~ dbinom(x= ceiling(0.5*n_observations):n_observations, size = n_observations, prob = bias) %>% sum,
    quantifier == "none" ~ dbinom(x= 0, size = n_observations, prob = bias) %>% sum,
    quantifier == "few"  ~ dbinom(x= 0:ceiling(0.3*n_observations), size = n_observations, prob = bias) %>% sum
  )
}

# calculate the probability P(sentence|H) analytically
# for a given bias (=hypothesis)
calculate_probability = function(resp, bias) {
  #unpack sentence
  resp = resp %>% str_split("\\|", simplify = F) %>% unlist()
  # reverse success probability if predicate is "wrong"
  bias = ifelse(resp[3] == "wrong", 1-bias, bias)
  # get probability of inner quantifier being true or a single itm
  inner_prob = calculate_probability_quantifier(resp[2], bias, 12)
  # get probability of outer quantifier statement
  calculate_probability_quantifier(resp[1], inner_prob, 5)
}

# testing
# calculate_probability("all|all|right", 0.8)
# calculate_probability("some|all|right", 0.8)

# calculate argumentative strength for a given bias
get_argument_strength = Vectorize(
  function(sentence, bias) {
    log(calculate_probability(sentence, bias) / calculate_probability(sentence, 1-bias))
  }
)

# testing
# get_argument_strength("most|all|right", 0.8)

## *********************************************************
## built a big look-up table & other useful structures  ----
## *********************************************************

# combine all sentences and situation
look_up_table <- 
  expand.grid(
    situation_number = 1:20,
    sentence = sentences
  ) %>% 
  full_join(situations, by = "situation_number") %>% 
  as_tibble() %>% 
  # add truth-values
  mutate(
    truth_value = get_truth_value(sentence, situation_number),
    arg_strength = get_argument_strength(sentence, bias = theta_arg)
  ) %>% 
  # add arg_strength of best true argument for each situation & condition
  group_by(situation_number) %>% 
  mutate(
    true_best_high = max(arg_strength[truth_value]),
    true_best_low  = max(-arg_strength[truth_value])
  )

# matrix representation of truth values
#   situations in rows, sentences in columns
truth_table <- look_up_table %>% 
  mutate(truth_value = as.numeric(truth_value)) %>% 
  select(situation_number, sentence, truth_value) %>% 
  pivot_wider(
    id_cols = c("situation_number"),
    names_from = sentence,
    values_from = truth_value
  )
truth_table_matrix <- as.matrix(truth_table[,-1])

# vector of arg_strength for each sentence (in correct order)
arg_strength_vector <- get_argument_strength(sentences, bias = theta_arg)

# vector of informativity for each sentence
informativity_vector <- log(1 / colSums(truth_table[,-1]))

# # check if entries are in the right order
# names(arg_strength_vector) == colnames(truth_table_matrix)

## *****************************
## add information to data  ----
## *****************************

get_best_high <- Vectorize(
  function(s_nr){
    filter(look_up_table, situation_number == s_nr) %>% pull(true_best_high) %>% .[1] %>% as.numeric()    
  }
)

get_best_low <- Vectorize(
  function(s_nr){
    filter(look_up_table, situation_number == s_nr) %>% pull(true_best_low) %>% .[1] %>% as.numeric()  
  }
)

get_informativity <- Vectorize(
  function(sentence) {
    informativity_vector[which(names(informativity_vector) == sentence)] %>% as.numeric()
  }
)

d = d %>% 
  mutate(
    # add truth-value 
    truth_value = get_truth_value(response, situation_number),
    # add argument strength
    arg_strength_raw = get_argument_strength(response, bias = theta_arg),
    arg_strength = ifelse(condition == "high", arg_strength_raw, - arg_strength_raw),
    true_best_high = get_best_high(situation_number),
    true_best_low  = get_best_low(situation_number),
    true_best = ifelse(condition == "high", true_best_high, true_best_low),
    # deviance from the max. arg_strength among all true statements
    best_arg_deviance = true_best - arg_strength,
    informativity = get_informativity(response) %>% as.numeric()
  )






