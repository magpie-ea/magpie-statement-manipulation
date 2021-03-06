## this file provides helper functions

library(tidyverse)


## ******************************
## set some global variables ----
## ******************************

theta_arg <- 0.85

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
calculate_probability("all|all|right", 0.9)
calculate_probability("none|some|wrong", 0.9)

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
    truth_value = get_truth_value(sentence, situation_number)
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

look_up_table <- 
  look_up_table %>% 
  # add arg-str and informativity related info 
  mutate(
    arg_strength = get_argument_strength(sentence, bias = theta_arg),
    informativity = informativity_vector[sentence]
  ) %>% 
  group_by(situation_number) %>% 
  mutate(
    true_best_high = max(arg_strength[truth_value]),
    true_best_low  = max(-arg_strength[truth_value]),
    best_info      = max(informativity[truth_value])
    # best_arg_high_sentence = sentences[truth_value][which.max(arg_strength[truth_value])],
    # best_arg_low_sentence = sentences[truth_value][which.max(-arg_strength[truth_value])],
    # best_info_sentence = sentences[truth_value][which.max(informativity[truth_value])]
  ) %>% 
  ungroup()
  

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

get_best_info <- Vectorize(
  function(s_nr) {
    filter(look_up_table, situation_number == s_nr) %>% pull(best_info) %>% .[1] %>% as.numeric()
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
    informativity = get_informativity(response) %>% as.numeric(),
    best_info = get_best_info(situation_number),
    best_info_deviance = best_info - informativity
  )

get_best_high(20)

## *****************************
## extract matrix of counts ----
## *****************************

# focus on only true responses

d_true <- filter(d, truth_value == T)

y_counts_high = matrix(0, nrow = 20, ncol = length(sentences))
y_counts_low  = matrix(0, nrow = 20, ncol = length(sentences))

colnames(y_counts_high) <- sentences
colnames(y_counts_low)  <- sentences

rownames(y_counts_high) <- str_c("Situation ", 1:20)
rownames(y_counts_low)  <- str_c("Situation ", 1:20)

for (i in 1:nrow(d_true)) {
  condition_i <- d_true$condition[i]
  response_i  <- d_true$response[i]
  situation_i <- d_true$situation_number[i]
  if (condition_i == "high") {
    y_counts_high[situation_i, which(sentences == response_i)] <-  
      y_counts_high[situation_i, which(sentences == response_i)] + 1
  } else {
    y_counts_low[situation_i, which(sentences == response_i)] <- 
      y_counts_low[situation_i, which(sentences == response_i)] + 1
  }
}

## *****************************
## plotting theme ----
## *****************************

theme_ida <- function(title.size = 16, text.size = 14,
                      legend.position = "top", show.axis = FALSE, 
                      plot.margin = c(.2, .1, .2, .1)){
  # baseline
  layout <- ggplot2::theme_classic()
  layout <- layout + theme(text = element_text(size = text.size),
                           title = element_text(size = title.size, 
                                                face = "bold"),
                           line = element_line(size = .5))
  
  # axes
  if (inherits(show.axis, "character") | show.axis == FALSE){
    if (inherits(show.axis, "character")){
      show.axis <- tolower(show.axis)
      if (show.axis == "x"){
        layout <- layout + theme(axis.line.y = element_blank())
      }
      if (show.axis == "y"){
        layout <- layout + theme(axis.line.x = element_blank())
      }
    } else {
      layout <- layout + theme(axis.line.x = element_blank(),
                               axis.line.y = element_blank())
    }
  }
  
  # legend
  layout <- layout + theme(legend.position = legend.position,
                           legend.background = element_blank(),
                           legend.key.height = unit(2, "line"))
  
  # facets 
  layout <- layout + theme(strip.background = element_blank(),
                           strip.text = element_text(size = title.size,
                                                     face = "bold"))
  
  # misc 
  layout <- layout + theme(panel.background = element_rect(fill = "transparent"),
                           plot.background = element_rect(fill = "transparent"),
                           plot.margin = unit(plot.margin, "cm"))
  
  layout
}

project_colors = rcartocolor::carto_pal(11, "Safe")[c(3,4,5,6,7,8,9,10,11,1,2)] # https://github.com/Nowosad/rcartocolor & https://carto.com/carto-colors/
# color blind friendly
# project_colors = c("#000000", "#E69F00", "#56B4E9", "#009E73", "#F0E442", "#0072B2", "#D55E00", "#CC79A7")
# project_colors =RColorBrewer::brewer.pal(8, "Set2")

# setting theme colors globally
## following: https://data-se.netlify.com/2018/12/12/changing-the-default-color-scheme-in-ggplot2/
scale_colour_discrete <- function(...) {
  scale_colour_manual(..., values = project_colors)
}
scale_fill_discrete <- function(...) {
  scale_fill_manual(..., values = project_colors)
} 

theme_set(
  theme_ida()
)
