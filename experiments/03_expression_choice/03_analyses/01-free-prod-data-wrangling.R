library(tidyverse)
library(plyr)

# Import data
d <- read_csv("./data/results-free-prod-30-01-coded.csv") %>% 
  select(-X5)

d$row_number <- as.factor(d$row_number)

d <- plyr::rename(d, c("type-sub"="type_sub", "type-obj"="type_obj"))

d$type_sub <- as.factor(d$type_sub)
d$type_obj <- as.factor(d$type_obj)
d$pred <- as.factor(d$pred)

d <- d %>% 
  mutate(quant_comb = case_when(type_sub == "non-num" & type_obj == "non-num" ~ "non-num_2",
                                type_sub == "non-num" & type_obj == "num" ~ "non-num_num",
                                type_sub == "non-num" & type_obj == "no" ~ "non-num_no",
                                type_sub == "num" & type_obj == "non-num" ~ "num_non-num",
                                type_sub == "num" & type_obj == "num" ~ "num_2",
                                type_sub == "num" & type_obj == "no" ~ "num_no",
                                TRUE ~ "other"))
 
d2 <- d %>% 
  drop_na(type_sub, type_obj)

d2 %>% 
  filter(row_number == "12|12|3|3|3" | row_number == "12|12|3|0|0" | row_number == "12|12|0|0|0") %>%
  ggplot(aes(x = quant_comb)) + 
  geom_bar()

d2 %>% 
  ggplot(aes(x = quant_comb)) + 
  geom_bar()

d2 %>%
  ggplot(aes(x = quant_com, fill = pred)) + 
  geom_bar()

