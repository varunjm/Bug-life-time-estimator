require("e1071")

bugdata<-read.csv("./data/data.csv",header=T)

# Load the party package. It will automatically load other dependent packages.
library(party)

# Create the input data frame.
input.dat <- bugdata

# Give the chart file a name.
# png(file = "./data/decision_tree.png")

# Create the tree.
  output.tree <- ctree(
  T ~ .,
  data = input.dat)#, controls = ctree_control(maxdepth = 3)
save(output.tree, file = "./data/decision_tree_model.rda")


# Plot the tree.
# plot(output.tree)

pred<-predict(output.tree,input.dat[,-1], type=c("response"))#3,4,6,0,31
count1=0
count2=0
len=length(pred)/length(pred[1,])
for(i in 1:len){
	val=pred[i]#which.max(pred[i,])
	if(val<input.dat[i,1]/2 || val>input.dat[i,1]*2){
		count1=count1+1
	}
	else{
		count2=count2+1
	}
}
print(count1)
print(count2)

# Save the file.
#dev.off()
