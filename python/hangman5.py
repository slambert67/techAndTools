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
    # delete the update of 1st character of progress and the printout of progress - that was just a test
    # you should now just have variable guess with the player's guessed letter
    # we need to find where in the initial phrase (if at all) the player's guess appears
    # again, we'll break it down in stages
    # So, simply loop through the initial phrase list (frog) and print out the character to the screen
    # In your case you should just get f,r,o,g
    # See https://www.w3schools.com/python/python_lists.asp for looping through a list
    # keep the break statement that exits the loop at the end

    
