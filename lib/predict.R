#needs("e1071")
#require("e1071")

load("./data/decision_tree_model.rda")
testdata<-read.csv("./data/test.csv",header=T)
pred<-predict(output.tree,testdata, type=c("response"))#3,4,6,0,31

print(pred[1])
