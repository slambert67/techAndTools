#Emily Spencer

print("You are about to play hangman !")       #tells the user what they are playing
while 1 == 1:                                  #infinite loop (always does this because 1 always equals 1)
    print("Menu: ")                                #print the menu options so the user knows how to        
    print("New Game= Enter 1")                     #play the game
    print("Quit= Enter 2")                         #exit the game
    choice= input("Enter your choice: ")           #asks the user what they want to select from these options
    if choice == "2":                              #if they select '2' they leave the game
        print("Leaving game...")                       #prints that they are leaving the game
        break                                          #leaves
    elif choice == "1":                            #if they select '1' the game starts
        print("Playing hangman...")                    #prints that they are starting to play a game of hangman
        phrase1= list("great white shark")             #stores the string as a list of separate characters 
        progress1= list("----- ----- -----")           #stores the string as a list of separate characters
        lives= 5                                       #stores the amount of lives
        print("".join(progress1))                      #prints the progress of the word the user is guessing as a whole word rather than separate characters
        while 1 == 1:                                  #infinite loop (constantly does this because 1 always equals 1)
            guess1= input("Guess a letter: ")              #asks the user to guess a letter
            counter= 0                                     #sets a counter to 0
            correctGuess= "n"                              #sets this to no because the correct phrase has not been guessed yet
            for i in phrase1:                              #goes through the phrase character by character
                if guess1 == i:                                #if the guess equals one of the characters
                    progress1[counter]= guess1                     #the counter increases every time it loops through so the place of the letter is changed to the guess
                    correctGuess= "y"                              #sets this to yes because if the progress has been updated it must be correct
                    print("".join(progress1))                      #print the updated progress of what the user has guessed
                counter= counter + 1                           #increase the counter by one to see if the next character is the same as the guess
            if correctGuess == "n":                            #if the guess was not in the phrase
                lives= lives - 1                               #it deducts 1 from the amount of lives
                print("Incorrect guess, you lose a life")      #tells the user that their guess was wrong
                if lives == 0:                                 #if they have no lives left
                    print("You lose, you have 0 lives left")       #prints that they have lost
                    break                                          #goes back to the main menu
            elif correctGuess == "y":                               #if the guess is correct
                print("Well done, you do not lose a life")             #tell the user they were right
                if ("".join(progress1)) == ("".join(phrase1)):                 #if the phrase they have guessed is the same as the original phrase
                    print("Congratulations, you guessed the phrase !")         #tell them they got it right
                    break                                                      #go back to the main menu
                                                      
                
            
        
