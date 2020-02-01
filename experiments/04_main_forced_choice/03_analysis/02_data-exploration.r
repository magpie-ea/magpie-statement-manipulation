# load helper functions
source('01_helpers.r')



## *********************************
## by-subject desriptive stats  ----
## *********************************

# by-subject & condition mean truth and mean arg.str
d %>% group_by(submission_id, condition) %>% 
  summarize(
    mean_true = mean(truth_value),
    mean_arg  = mean(arg_strength)
  )
  
# by situation & condition argument strength
d %>% group_by(situation_number, condition) %>% 
  summarize(
    mean_true = mean(truth_value),
    mean_arg  = mean(arg_strength)
  ) %>% View()


stop()


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






d %>% 
  group_by(condition, response) %>% 
  tally() %>% 
  pivot_wider(
    names_from = condition,
    values_from = n
  ) %>% 
  ungroup() %>% 
  pivot_longer(
    -response,
    names_to = "condition",
    values_to = "count"
  ) %>% 
  full_join(arg_strength) %>% 
  mutate(
    arg_str = ifelse(condition == "high", arg_str, -arg_str)
  ) %>%
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
  filter(count > min_count_to_show) %>%
  ggplot(
    mapping = aes(
      x = fct_reorder(response, arg_str), 
      y = count, 
      group = condition, 
      fill = condition,
    )
  ) +
  geom_col(position = "dodge") +
  # geom_col(data = plot_data_low, fill = "darkorange") + 
  # geom_col(data = plot_data_high, fill = "darkgreen") + 
  coord_flip() +
  # ylim(c(-max_count, max_count)) +
  labs(
    x = ""
  )





