library(tidyverse)

# Import data
d <- read_csv("./data/results_81_statement-manipulation-ethics_VMS.csv")

# # Remove data from test run
# d <- d %>% 
#   filter(submission_id != 11532)

# Remove irrelevant variables
d2 <- d %>% 
  select(submission_id, question, response, row_number)

# Turn variable 'question' into a factor (w/ 2 levels)
d2$question <- as.factor(d2$question)

# Recode 'question' in terms of a new variable called 'framing'
# 'framing' encodes the framing in which participants were asked to produce their descriptions
d2 <- d2 %>% 
  mutate(framing = case_when(question == "Describe these results of <strong>Green Valley</strong> so as to make it appear as if there is a <strong>high</strong> success rate without lying." ~ "high",
                             question == "Describe these results of <strong>Riverside</strong> so as to make it appear as if there is a <strong>low</strong> success rate without lying." ~ "low")) %>% 
  select(-question)

# Produce a clean data set
write.csv(d2, "results-free-prod-30-01.csv", row.names = FALSE)

