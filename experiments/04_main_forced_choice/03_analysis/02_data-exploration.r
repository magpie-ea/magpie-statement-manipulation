# load helper functions
source('01_helpers.r')

## ***********************************
## exploring the design / set-up  ----
## ***********************************

tibble(
  informativity = informativity_vector,
  arg_strength  = arg_strength_vector,
  sentence = names(arg_strength)
) %>% 
  ggplot(
    aes(
      x = informativity,
      y = arg_strength
    )
  ) +
  geom_point(alpha = 0.4) 
  # ggrepel::geom_text_repel(aes(label = sentence))

## ******************************
## various desriptive stats  ----
## ******************************

d %>% count(truth_value) # most answers were true!!

# by-subject & condition mean truth and mean arg.str
d %>% group_by(submission_id, condition) %>% 
  summarize(
    mean_true = mean(truth_value),
    mean_arg  = mean(best_arg_deviance),
    mean_info = mean(informativity)
  ) %>% 
  ggplot(aes(x = mean_info, y = mean_arg, color = mean_true)) + 
  geom_smooth(method = "lm", color = "darkgreen", alpha = 0.3) +
  geom_point()
  
# by situation & condition argument strength
d %>% group_by(situation_number, condition) %>% 
  summarize(
    mean_true = mean(truth_value),
    mean_arg  = mean(true_best - arg_strength)
  ) %>% View()


## *********************************
## by-subject desriptive stats  ----
## *********************************

d %>%
  filter( truth_value == TRUE) %>% 
  ggplot(aes(y = best_arg_deviance, x = situation_number)) +
  geom_jitter(alpha = 0.3) +
  facet_wrap(. ~ condition)

stop()









