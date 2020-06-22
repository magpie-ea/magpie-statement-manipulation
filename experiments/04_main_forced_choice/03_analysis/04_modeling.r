library(greta)

source('01_helpers.r')

##*************************************
## ---- fidget a soft-max function ----
## https://github.com/greta-dev/greta/issues/120#comment-362489577
##*************************************

# library(tensorflow)
# op <- greta::.internals$nodes$constructors$op
# softmax <- function (logits) {
#   op("softmax", logits, tf_operation = tf$nn$softmax)
# }

##*************************************
## ---- testing multinomial models ----
##*************************************

# obs <- matrix(
#   c(10,30,50,
#     23,14,67),
#   nrow = 2,
#   byrow = T
# )
# y <- as_data(obs)
# pred <- dirichlet(t(c(1,1,1)), n_realisations = 2)
# distribution(y) <- multinomial(size = rowSums(obs), prob = pred)
# m <- model(pred)
# samples <- greta::mcmc(m, n_samples =1000)
# bayesplot::mcmc_dens(samples)


##***************************************
## ---- test soft-max implementation ----
##***************************************

# alpha <- uniform(0.9,1.1)
# utils <- as_data(matrix(c(5,10,1, 4,4,4), nrow = 2, byrow = T))
# logits <- exp(alpha * utils)
# logit_sums <- greta::apply(logits, MARGIN = 1, FUN = "sum")
# pred <- sweep(logits, 1, logit_sums, FUN = "/")
# 
# m <- model(pred)
# 
# opt(m)

##************************************
## ---- dummy fit for actual data ----
##************************************

# alpha <- uniform(0,100)
# y <- as_data(y_counts_high)
# # pred <- dirichlet(t(rep(1/ncol(y), ncol(y))), n_realisations = nrow(y))
# utils <- dirichlet(t(rep(1, ncol(y))), n_realisations = nrow(y))
# logits <- exp(alpha * utils)
# logit_sums <- greta::apply(logits, MARGIN = 1, FUN = "sum")
# pred <- sweep(logits, 1, logit_sums, FUN = "/")
# distribution(y) <- multinomial(size = rowSums(y), prob = pred)
# m <- model(pred)
# opt(m)$par$pred -> fit_opt

# fit_opt[1:5, 1:5]
# prop.table(y_counts_high,1)[1:5, 1:5]

# plot(prop.table(y_counts_high,1) %>% as.vector, fit_opt %>% as.vector)

##*************************************
## ---- actual fit for actual data ----
##*************************************

## data for greta

y_high <- as_data(y_counts_high)
# y_high_i <- as_data(t(y_counts_high[1,]))
y_low  <- as_data(y_counts_low)

## priors

# theta_false <- inverse_gamma(.5, .5)
# theta_neg <- gamma(0.5,0.5)
# theta_false <- uniform(- 10000, 0)
# theta_neg <- uniform(- 10000, 0)
# theta_false <- uniform(-100,0)
# theta_neg <- uniform(-10,0)
theta_neg <- -3
theta_info_arg_weight <- uniform(0,1)
theta_alpha <- uniform(0,5)

## predictions
#### (build matrix representations for utility ingredients (sit x sent))
truth_matrix_greta <- (1 - truth_table_matrix) * -60
# cost 
boolean_negation_matrix <-  # entry 1 for all sentences containing "none"
  matrix(rep(str_detect(sentences, "none") %>% as.numeric, times = 20), nrow = 20, byrow = T)
cost_matrix_greta <- theta_neg * boolean_negation_matrix
# informativity
info_matrix_greta <- 
  matrix(rep(informativity_vector, each = 20), nrow = 20)
# argumentative strength
argstr_matrix_greta_high <- 
  matrix(rep(arg_strength_vector, times = 20), nrow = 20, byrow = T)
argstr_matrix_greta_low <-
  matrix(rep(-arg_strength_vector, times = 20), nrow = 20, byrow = T)
# utility
util_high <- truth_matrix_greta + 
  cost_matrix_greta + 
  theta_info_arg_weight * info_matrix_greta + 
  (1 - theta_info_arg_weight) * argstr_matrix_greta_high
util_low <- truth_matrix_greta +
  cost_matrix_greta +
  theta_info_arg_weight * info_matrix_greta +
  (1 - theta_info_arg_weight) * argstr_matrix_greta_low

# prediction
logits_high <- exp(theta_alpha * util_high)
logits_low  <- exp(theta_alpha * util_low)
logit_sums_high <- greta::apply(logits_high, MARGIN = 1, FUN = "sum")
logit_sums_low  <- greta::apply(logits_low,  MARGIN = 1, FUN = "sum")
pred_high <- sweep(logits_high, 1, logit_sums_high, FUN = "/")
pred_low  <- sweep(logits_low, 1,  logit_sums_low,  FUN = "/")

## likelihood

distribution(y_high) <- multinomial(size = rowSums(y_counts_high), prob = pred_high)
distribution(y_low)  <- multinomial(size = rowSums(y_counts_low),  prob = pred_low)

## define model

m <- model(
  pred_high, 
  pred_low, 
  theta_info_arg_weight, 
  theta_alpha
)

# samples <- greta::mcmc(m, n_samples =1000)
# bayesplot::mcmc_dens(samples)
# bayesplot::mcmc_pairs(samples)

fit_MAP <- opt(m)
show(fit_MAP)

# exploring MAP-predictions

obs_tibble <- as_tibble(
  rbind(prop.table(y_counts_high,1),
        prop.table(y_counts_low,1)
  )
) %>% 
  mutate(
    situation = rep(1:20,2), 
    condition = rep(c("high", "low"), each = 20)
  ) %>%  
  pivot_longer(
    cols = - c("situation", "condition"), 
    names_to = "sentence", 
    values_to = "observed"
  ) %>% 
  mutate(
    predicted = rbind(fit_MAP$par$pred_high, fit_MAP$par$pred_low)  %>% 
      as_tibble() %>% 
      pivot_longer(everything()) %>% 
      pull(value) %>% 
      as.vector(),
    truth = rbind(truth_table_matrix, truth_table_matrix) %>% 
      as_tibble() %>% 
      pivot_longer(everything()) %>% 
      pull(value) %>% 
      as.vector(),
    arg_str = arg_strength_vector[sentence],
    informativity = informativity_vector[sentence],
    pred_error = predicted - observed
    ) %>% 
  arrange(condition, situation, -abs(pred_error))


with(obs_tibble,
     cor.test(predicted, observed)
) %>% show()
  
message(
  "Correlation overall: ",
  with(obs_tibble, cor.test(predicted, observed))$estimate %>% signif(3)
)
message(
  "Correlation 'high': ",
  with(obs_tibble %>% filter(condition == "high"), cor.test(predicted, observed))$estimate %>% signif(3)
)
message(
  "Correlation 'low': ",
  with(obs_tibble %>% filter(condition == "low"), cor.test(predicted, observed))$estimate %>% signif(3)
)


# View(obs_tibble)

obs_pred_plot <- obs_tibble %>% 
  ggplot(aes( x = predicted, y = observed, color = condition)) + 
  geom_smooth(method = "lm") +
  geom_point( alpha = 0.5)

##******************************************
## ---- samples from Bayesian posterior ----
##******************************************

samples <- greta::mcmc(m, n_samples = 4000, thin = 2)
tidy_draws <- ggmcmc::ggs(samples) %>% 
  filter(!str_detect(Parameter, "pred"))

# obtain Bayesian point and interval estimates
Bayes_estimates <- tidy_draws %>% 
  group_by(Parameter) %>%
  summarise(
    '|95%' = HDInterval::hdi(value)[1],
    mean = mean(value),
    '95|%' = HDInterval::hdi(value)[2]
  )
Bayes_estimates

##******************************************
## ---- plotting the Bayesian posterior ----
##******************************************

dens_alpha <- filter(tidy_draws, Parameter == "theta_alpha") %>% pull(value) %>% 
  density()
dens_beta <- filter(tidy_draws, Parameter == "theta_info_arg_weight") %>% pull(value) %>% 
  density()

post_plot_data <- 
  tibble(
    parameter = c(rep("alpha", length(dens_alpha$x)), rep("beta", length(dens_beta$x))),
    x = c(dens_alpha$x, dens_beta$x),
    y = c(dens_alpha$y, dens_beta$y),
    x_area = case_when(
      parameter == "alpha" ~ ifelse(x > Bayes_estimates[1,2] %>% as.numeric & x < Bayes_estimates[1,4] %>% as.numeric, x, NA ),
      parameter == "beta"  ~ ifelse(x > Bayes_estimates[2,2] %>% as.numeric & x < Bayes_estimates[2,4] %>% as.numeric, x, NA )
    )
  ) 

posterior_plot <- 
  post_plot_data %>% 
  ggplot(aes(x = x, y = y)) +
  geom_line(size = 1.5) +
  geom_area(aes(x = x_area),
            fill = "firebrick", alpha = 0.5) +
  facet_wrap(~parameter, scales = "free", labeller = label_parsed) +
  labs(
    x = "",
    y = ""
  )

ggsave(plot = posterior_plot, filename = "posterior_plot.png", width = 4, height = 2.5)


