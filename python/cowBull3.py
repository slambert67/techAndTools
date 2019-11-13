# function to show introduction to user
def print_intro():
  print("Welcome to the game of cow bull!\n\n")


# function to play the actual game
def play_cow_bull():
  print("\nPlaying a game of cow bull\n\n")
 
 
# ask user if he/she wants to play another game
def prompt_user():
  global anotherGame
  
  # show user menu
  print('Another Game?: 1')
  print('Exit    : 2')
  choice = input('Enter your selection: ')
  
  if choice == str(1):
    print("\nOK ...")
  elif choice == str(2):
    print("\nNo more games of cow bull :(\n")
    anotherGame = False # end the program
  else:
    print("\nInvalid choice - exiting game anyway!")
    anotherGame = False # end the program
    

# main program
anotherGame = True # global variable
while anotherGame:

  play_cow_bull()
  
  prompt_user()
  

