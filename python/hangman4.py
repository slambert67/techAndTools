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
  
  phrase = list('great white shark') # defines a list (not a string) representing what you want player to find out
                                     # same as phrase = ['g', 'r', 'e', ...]  but shorter syntax
                                     # phrase variable now doesn't change during rest of program
                                     # so we can compare players progress against this
                                     
  progress = list('----- ----- -----') # defines a list representing the players progress. 
                                       # initially there is no progress so there is a '-' for each letters
                                       # printing this out shows player their progress
                                       
  lives = 3 # defines the number of lives you are giving the player
 
  print('\nPlaying hangman ...\n')
  print(''.join(progress) ) # prints out players progress so far. Initially no progress!
                            # don't worry for now about the ''.join(progress)
                            # all it's doing is converting progress (which is a list) into a string (which the print statement needs) 
 
  while (1 == 1):
  
    # TODO
    # first delete everything you have INSIDE this loop
    # declare a variable called guess and ask the player to guess a letter
    # for now forget about wether the guess is correct or not
    # update the FIRST letter of the progress variable with the players guess
    # print out the progress variable and then exit the loop with a break
    # this then simply tests that you can correctly get input from the user and update progress
    # we'll update progress properly in the next stage

    
