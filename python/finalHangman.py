# declare and initialise variables
choice = ''

print ('You are about to play some games of Hangman!\n')

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
  phrase = list('great white shark')
  progress = list('----- ----- -----')
  lives = 3

  print('\nPlaying hangman ...\n')
  print(''.join(progress))
  while (1 == 1):

    correctGuess = 'n'
    guess = input('\nGuess a letter: ')

    # search for instances of this letter in the original phrase
    index = 0
    for letter in phrase:
      if letter == guess:
        correctGuess = 'y'
        progress[index] = guess
      index = index + 1

    print('\nprogress = ' + ''.join(progress) )
    
    if correctGuess == 'y':
      print('\nCorrect guess - well done. You do not lose a life')
      if ''.join(progress) == ''.join(phrase):
        print('\nCongratulations - you have won!!!\n')
        break
    else:
      print('\nIncorrect guess - lose a life!')
      lives = lives - 1
      if lives == 0:
        print('\nYou have run out of lives\n')
        break    

      


    
