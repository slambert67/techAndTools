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
    # The code you just showed me was:
    # for i in phrase1:
    #   if guess1 in i      <- this is better as == i
    #     print('yay')
    # 
    # implement something similar:
    # we need to know where in phrase the guess is so we need to count how far through the phrase list we have got
    # so, declare a variable (maybe called counter?) before the for loop and initialise it to 0
    # if you find a match straight away then it's at position 0 ie. the value of counter.
    # you can then update progress at this position ie.progress[counter] = guess. progress would now be f--- if you guessed f
    # after this test (outside the if but inside the for loop) increase counter by 1
    # the next time around the loop you now know you're at the next position.
    # maybe choose a word that has the same letter appearing more than once so you can see it updated properly in progress?

    
