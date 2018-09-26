# task 4.1

#
# declare variables (with good readable names!)
#
dailyCharge = 35  # integer: daily charge in pounds
mileCharge = 0.1  # decimal: charge per mile in pounds

#
# request required information from user
#

# this date information isn't needed in the calculations
# I've just used it in the output
dateRentedD = int(input("Day the car was rented(dd): "))    # integer
dateRentedM = int(input("Month the car was rented(dd): "))  # integer
dateRentedY = int(input("Year the car was rented(dd): "))   # integer

numberOfDaysRented = int(input("Number of days rented: "))

# you put HELP!! for this bit
# this is the number of miles the car has done before the user rents it and
# starts to do their own miles
# you seem to have done the calculation correctly so not sure what you didn't understand
mileageBefore = int(input("Mileage before car was rented: "))  # integer

mileageAfter = int(input("Mileage when rented car is returned: "))  # integer

# you have defined variables for the returned date but the 
# question doesn't ask for this
# dateReturnedD = int(input("Day the car was returned(dd): "))        # integer
# dateReturnedM = int(input("Month the car was returned(dd): "))      # integer
# dateReturnedY = int(input("Year the car was returned(dd): "))       # integer

#
# do calculations after ALL input requested from user
#

# calculate the total rental charge (not including mileage)
totalRentalCharge = numberOfDaysRented * dailyCharge  # integer

# calculate the number of miles the person renting the car drove
milesDriven = mileageAfter - mileageBefore

# calculate the total mileage charge
totalMileageCharge = milesDriven * mileCharge

# calculate the total charge
totalCharge = totalRentalCharge + totalMileageCharge

# the question doesn't specify exactly what output is required
# use str to convert everything to a string for output
print ('data car rented: ' + str(dateRentedD) + '/'+ str(dateRentedM) + '/'+ str(dateRentedY))
print ('rental charge = ' + str(totalRentalCharge))
print ('mileage charge = ' + str(totalMileageCharge))
print ('total charge = ' + str(totalCharge))


