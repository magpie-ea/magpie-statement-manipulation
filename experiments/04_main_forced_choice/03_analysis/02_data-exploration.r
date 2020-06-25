# load helper functions
source('01_helpers.r')

fit_MAP <- readRDS("fit_MAP.RDS")

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
  geom_point(alpha = 0.4) + theme_ida()
  # ggrepel::geom_text_repel(aes(label = sentence))

## ******************************
## various desriptive stats  ----
## ******************************

d %>% count(truth_value) # most answers were true!!

d_true %>% 
  group_by(condition) %>% 
  summarise(
    mean_info = mean(informativity),
    mean_argu = mean(arg_strength)
  )

# by-subject & condition mean truth and mean arg.str
d_true %>% group_by(submission_id, condition) %>% 
  summarize(
    mean_arg  = mean(best_arg_deviance),
    mean_info = mean(best_info_deviance)
  ) %>% 
  ggplot(aes(x = mean_info, y = mean_arg, color = condition)) + 
  geom_smooth(method = "lm", color = "darkgreen", alpha = 0.3) +
  geom_point()
  
# by-situation & condition mean truth and mean arg.str
d_true %>% group_by(situation_number, condition) %>% 
  summarize(
    mean_arg  = mean(best_arg_deviance),
    mean_info = mean(best_info_deviance)
  ) %>% 
  ggplot(aes(x = mean_info, y = mean_arg, color = condition)) + 
  geom_smooth(method = "lm", color = "darkgreen", alpha = 0.3) +
  geom_point() +
  ggrepel::geom_text_repel(aes(label = situation_number))

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


## ***************************************
## comparison delta-arg / delta-info  ----
## ***************************************

d_true %>% 
  ggplot(
    aes(
      x = best_info_deviance, 
      y = best_arg_deviance,
      color = condition
    )
  ) +
  geom_point()

s_nr = 2
model_prediction = as.matrix(fit_MAP$par$pred_high)
colnames(model_prediction) = sentences
d_true %>% 
  filter(situation_number == s_nr, condition == "high") %>% 
  count(condition, response) %>% 
  group_by(condition) %>% 
  mutate(
    arg_str = arg_strength_vector[response],
    info = informativity_vector[response],
    model_pred = model_prediction[s_nr,response]
  ) %>% 
  View()

# for each situation get the proportion of best-info and best-arg choices

proportions_by_situation <- d_true %>% 
  # filter(condition == "high") %>% 
  group_by(situation_number, condition) %>% 
  count(response, best_arg_deviance, best_info_deviance) %>%
  mutate(
    proportion = n / sum(n)
  ) %>% 
  summarise(
    proportion_best_arg = ifelse(
      0 %in% best_arg_deviance,
      proportion[which(best_arg_deviance == 0)],
      0
    ),
    proportion_best_info = ifelse(
      0 %in% best_info_deviance,
      proportion[which(best_info_deviance == 0)],
      0
    ),
    modal_arg  = str_c(response[which(min(best_arg_deviance) == best_arg_deviance)], collapse = "::")[1],
    modal_info = str_c(response[which(min(best_info_deviance) == best_info_deviance)], collapse = "::")[1],
    modal_resp = response[which(max(proportion) == proportion)],
    modal_resp_best_arg  = response[which(proportion == max(proportion))] %in% 
      response[which(min(best_arg_deviance) == best_arg_deviance)],
    modal_resp_best_info = response[which(proportion == max(proportion))] %in% 
      response[which(min(best_info_deviance) == best_info_deviance)]
  )

p2 <- proportions_by_situation %>% 
  pivot_longer(c("proportion_best_arg", "proportion_best_info")) %>%
  filter(situation_number %in% c(1, 5, 7, 10, 15, 17, 20)) %>% 
  ggplot(aes(x = name, y = value, fill = name)) +
  geom_col() +
  coord_flip() +
  # checks and marks
  # custom axis
  geom_segment(aes(x = 0, xend = 3, y = 0, yend = 0 ), color = "black") +
  # geom_text(aes(x = 1.5, y = -0.025, label = "0"), size = 3, color = "lightgray") +
  geom_segment(aes(x = 0, xend = 3, y = 1, yend = 1 ), color = "black") +
  # geom_text(
  #   data = filter(proportions_by_situation, modal_resp_best_arg == T),
  #   aes(x = 1, y = 1.025, label = "X"),
  #   size = 3,
  #   color = "darkred"
  # ) +
  # facets & style
  facet_grid(situation_number ~ condition) +
  theme_void() +
  # theme_ida(y.axis = F) +
  theme(
    axis.ticks = element_blank(),
    axis.text =  element_blank(),
    axis.title = element_blank(),
    strip.text = element_blank(),
    legend.position = "none",
    panel.spacing.x = unit(4, "lines")
  ) +
  scale_fill_manual(values = c("#a6cee3", "#1f78b4")) +
  scale_y_reverse()

g1 <- ggplotGrob(p1)
g2 <- ggplotGrob(p2)

panels <- c('panel-1-1', 'panel-1-2', 'panel-2-1', 'panel-2-2', 'panel-1-3', 'panel-2-3', 'panel-1-4')

for (p in panels){
  g1$grobs[grep(p, g1$layout$name)] <- g2$grobs[grep(p, g2$layout$name)]
}

grid.newpage()

grid.draw(g1)

# sc01 <- image_read("../04_situation_plots/scene01-sing.png")
# sc02 <- image_read("../04_situation_plots/scene02-sing.png")
# sc03 <- image_read("../04_situation_plots/scene03-sing.png")
# sc04 <- image_read("../04_situation_plots/scene04-sing.png")
# sc05 <- image_read("../04_situation_plots/scene05-sing.png")
# sc06 <- image_read("../04_situation_plots/scene06-sing.png")
# sc07 <- image_read("../04_situation_plots/scene07-sing.png")
# 
# ggdraw(g1) + 
#   draw_image(sc01, x = .5, y = .5, scale = .1) #+
#   # draw_image(homo_hetero, x = -.18, y = .32, scale = .12) +
#   draw_image(hetero, x = .38, y = .08, scale = .20) +
#   # draw_image(hetero, x = -.18, y = .06, scale = .12) +
#   # draw_image(homo, x = .15, y = -.18, scale = .12) +
#   draw_image(homo, x = .38, y = -.12, scale = .20)

ggsave("produc-choice.png", g1)

## ***********************************
## comparison between conditions  ----
## ***********************************

d_true %>% 
  select(condition, best_arg_deviance, best_info_deviance) %>% 
  pivot_longer(2:3) %>% 
  ggplot(aes(x = value)) +
  geom_histogram() +
  facet_grid(condition ~ name, scales = "free")

d_true %>% 
  select(condition, best_arg_deviance, best_info_deviance) %>% 
  pivot_longer(2:3) %>% 
  group_by(name, condition) %>% 
  summarize(
    mean = mean(value)
  )

# arg_deviance: credibly higher in LOW condition
brms::brm(
  formula = best_arg_deviance ~ condition + 
    (1 | submission_id) + 
    (1 | situation_number) , 
  data = d_true
) %>% summary()


# informativity: no credible difference
brms::brm(
  formula = best_info_deviance ~ condition + 
    (1 | submission_id) + 
    (1 | situation_number) , 
  data = d_true,
  iter = 5000
) %>% summary()

stop()









