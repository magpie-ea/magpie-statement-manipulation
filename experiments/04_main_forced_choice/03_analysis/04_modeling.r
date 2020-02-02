library(greta)

# source('01_helpers.r')

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
theta_neg <- 0
theta_info_arg_weight <- uniform(0,1)
theta_alpha <- uniform(0,10)

## predictions
#### (build matrix representations for utility ingredients (sit x sent))
truth_matrix_greta <- (1 - truth_table_matrix) * -20
# truth_matrix_greta <- log(truth_table_matrix)
# cost 
boolean_negation_matrix <-  # entry 1 for all sentences starting with "none"
  matrix(rep(c(0,0,0,1), times = 8 * 20), nrow = 20, byrow = T)
cost_matrix_greta <- theta_neg * boolean_negation_matrix
# informativity
info_matrix_greta <- 
  matrix(rep(informativity_vector, each = 20), nrow = 20)
# argumentative strength
argstr_matrix_greta <- 
  matrix(rep(arg_strength_vector, times = 20), nrow = 20, byrow = T)
# utility
util <- truth_matrix_greta + cost_matrix_greta + 
  info_matrix_greta + (1 - theta_info_arg_weight) * argstr_matrix_greta
# prediction
logits <- exp(theta_alpha * util)
logit_sums <- greta::apply(logits, MARGIN = 1, FUN = "sum")
pred <- sweep(logits, 1, logit_sums, FUN = "/") 

## likelihood

distribution(y_high) <- multinomial(size = rowSums(y_counts_high), prob = pred)

## define model

m <- model(pred, theta_info_arg_weight, theta_alpha)

# samples <- greta::mcmc(m, n_samples =1000)
# bayesplot::mcmc_dens(samples)
# bayesplot::mcmc_pairs(samples)

fit_MAP <- opt(m)
show(fit_MAP)

# exploring MAP-predictions

obs_tibble <- as_tibble(prop.table(y_counts_high,1)) %>% mutate(situation = 1:20) %>%  
  pivot_longer(cols = - situation, names_to = "sentence", values_to = "observed") %>% 
  mutate(
    predicted = fit_MAP$par$pred %>% 
      as_tibble() %>% 
      pivot_longer(everything()) %>% 
      pull(value) %>% 
      as.vector(),
    truth = truth_table_matrix %>% 
      as_tibble() %>% 
      pivot_longer(everything()) %>% 
      pull(value) %>% 
      as.vector(),
    arg_str = arg_strength_vector[sentence],
    informativity = informativity_vector[sentence],
    pred_error = predicted - observed
    ) %>% 
  arrange(situation, -abs(pred_error))

# View(obs_tibble)

obs_tibble %>% 
  ggplot(aes( x = predicted, y = observed)) + 
  geom_smooth(method = "lm") +
  geom_point() 





stop()

stop()

samples <- greta::mcmc(m, n_samples = 1000)
bayesplot::mcmc_dens(samples)
bayesplot::mcmc_pairs(samples)
bayesplot::mcmc_trace(samples)



get_prediction <- function(theta_false, theta_neg, theta_mix, theta_rat){
  truth <- 1
  TRUE
}











