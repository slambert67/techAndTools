# declare and initialise variables
choice = ''

print ('You are about to play some games of Hangman!')

while (1 == 1): # infinite loop. 1 always = 1

  # show user menu
  print('New Game: 1')
  print('Exit    : 2')
  choice = input('Enter your selection: ')
  
  # exit program if user selects choice 2
  if choice == str(2):
    print('Leaving game ...')
    break # exit outer menu loop

  # otherwise play a new game of hangman 
  
  # TODO Here is the start of a new game
  #      Before asking player to make some guesses we need to initialise the game
  #      Python doesn't allow you to change the value of a string.
  #      So, we will use lists and convert them to strings when we want to - eg. for output
  #      There is a function called list that converts a string to a list
  #      eg. mylist = list('hello') creates this list: ['h','e','l','l','0']
  #
  #      1. Define a variable of type list called phrase that has the value you want the player of hangman to guess
  #      2. Define a variable of type list called progress. The value will be the same as phrase but with letters replaced by '-'
  #      3. Define a variable called lives and give it a value. This is how many lives you are allowing the player.
  #      4. Print these 3 values to the screen
  #         Hint: print only prints out variables of type string
  #               we therefore need to convert our list variables to strings for printing out
  #               Don't worry about details yet but use this syntax:
  #                 print('mylist converted to string looks like this: ' + ''.join(mylist) )
  while (1 == 1):
    print('Playing hangman ...')
    choice = input('Is game over yet?: ') # enter y for yes
    
    # exit the hangman game if it is finished
    if choice == 'y':
      print('Game has finished')
      break # exit inner hangman game loop
    
