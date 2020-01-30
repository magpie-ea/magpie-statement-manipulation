library(tidyverse)

d = read_csv('../02_data/data_raw.csv') %>% 
  # fix typo in column head
  rename(situation_number = sitation_number) %>% 
  # remove incomplete answer
  filter(response != "some|some|")


## semantics of expressions ----

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

calculate_probability("all|all|right", 0.8)
calculate_probability("some|all|right", 0.8)

get_truth_value = function(example_index) {
  
  resp     = d$response[example_index]
  stimulus = d$stimulus[example_index] %>% str_split("\\|", simplify = F) %>% unlist()
  
  if (length(stimulus) <= d$column_number[example_index]) {
    return(NA)
  }
  else {
    stimulus = stimulus %>% as.numeric() %>% matrix(byrow = T, ncol = d$column_number[example_index])
    stimulus = 1 - stimulus
  }

  evaluate_truth(resp, stimulus)
  
}

truth = map_lgl(1:nrow(d), function(i){
  get_truth_value(i)
})

d$truth = truth

counts =  d %>% 
  filter(truth == TRUE) %>% 
  group_by(condition, response) %>% 
  tally() %>% 
  pivot_wider(
    names_from = condition,
    values_from = n
  )

counts %>% arrange(- high) %>% head()
counts %>% arrange(- low) %>% head()

d %>% group_by(situation_number, condition) %>% 
  summarise(
    mean_true = mean(truth, na.rm = T)
  ) %>% show()

d %>% group_by(condition) %>% 
  summarise(
    mean_true = mean(truth, na.rm = T)
  ) %>% show()


# calculate argumentative strength for a given bias
get_argument_strength = function(bias) {
  out = expand_grid(
    outer = c("all", "some", "most", "none", "many", "few"),
    inner = c("all", "some", "most", "none", "many", "few"),
    predicate = c("right", "wrong"),
    bias = bias
  ) %>% 
    group_by(outer, inner, predicate) %>% 
    mutate(
      sentence = paste0(outer, "|", inner, "|", predicate),
      bias = bias,
      probability = calculate_probability(sentence, bias)
    )
  out
}

# get_argument_strength(0.8)

arg_strength = rbind(get_argument_strength(0.2), get_argument_strength(0.8)) %>% 
  pivot_wider(
    names_from = bias,
    names_prefix = "bias_",
    values_from = probability
  ) %>% 
  mutate(
    arg_str = log(bias_0.8) - log(bias_0.2)
  ) %>% 
  ungroup() %>% 
  select(sentence, arg_str, bias_0.2, bias_0.8) %>% 
  rename(response = sentence)

plot_data = counts %>% ungroup() %>% 
  pivot_longer(
    -response,
    names_to = "condition",
    values_to = "count"
  ) %>% 
  full_join(arg_strength) %>% 
  mutate(
    arg_str = ifelse(condition == "high", arg_str, -arg_str)
  )
  
plot_data %>%
  filter(count > 5 ) %>%
  ggplot(aes(y = count, x = (arg_str), color = condition)) + 
  geom_point() +
  geom_smooth(method = "lm") +
  ggrepel::geom_text_repel(aes(label = response))

max_count = max(plot_data$count,na.rm = T)
min_count_to_show = 0
plot_data_high = filter(plot_data, condition == "high", count >= min_count_to_show)
plot_data_low = filter(plot_data, condition == "low", count >= min_count_to_show) %>% 
  mutate(count = - count)

plot_data %>% 
  filter(count > 1) %>% 
  ggplot(
    mapping = aes(
      x = fct_reorder(response, arg_str), 
      y = count, 
      group = condition, 
      fill = condition
    )
  ) +
  geom_col(data = plot_data_low, fill = "darkorange") + 
  geom_col(data = plot_data_high, fill = "darkgreen") + 
  coord_flip() +
  ylim(c(-max_count, max_count)) +
  labs(
    x = ""
  )

