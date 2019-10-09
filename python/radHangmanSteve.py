# #######################################################################
#
# Author : Emily Lucy Spencer
# Program: Hangman game
#
# Modification History
# 1.0  Emily Spencer  5th-Jan-2019  Initial version.
#
# #######################################################################

# TODO: Make output clearer

print("You are about to play hangman !") 

# play hangman games until player quits     
while 1 == 1:      

    # show options menu to player                   
    print("Menu: ")                                     
    print("New Game= Enter 1")   
    print("Quit= Enter 2")     
    choice= input("Enter your choice: ")   
    
    if choice == "2":        
        # player has chosen to quit the program    
        print("Leaving game...")                     
        break  
        
    elif choice == "1":       
        # player has chosen to play another game    
        print("Playing hangman...")    

        # initialise this new game   
        # TODO: implement a greater choice of phrases        
        phrase1= list("great white shark")            
        progress1= list("----- ----- -----")       
        lives= 5                                       
        print("".join(progress1))   

        # prompt user for guesses until end of game        
        while 1 == 1:                                  
            guess1= input("Guess a letter: ") 

            # compare each character of phrase wth guess and update progress accordingly           
            counter= 0                                  
            correctGuess= "n"                             
            for i in phrase1:                             
                if guess1 == i:   
                    # match found so update progress and note that this was a correct guess                
                    progress1[counter]= guess1                     
                    correctGuess= "y"                              
                    print("".join(progress1))                      
                counter= counter + 1   
                
            if correctGuess == "n":    
                # incorrect guess so player loses a life            
                lives= lives - 1                               
                print("Incorrect guess, you lose a life")      
                if lives == 0:     
                    # player is out of lives and loses                
                    print("You lose, you have 0 lives left")       
                    break                                          
            elif correctGuess == "y":                               
                print("Well done, you do not lose a life")             
                if ("".join(progress1)) == ("".join(phrase1)): 
                    # player has guessed the phrase and wins                
                    print("Congratulations, you guessed the phrase !")         
                    break                                                      
                                                      
                
            
        
