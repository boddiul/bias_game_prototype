from chatgpt_controller import ChatGPTController
import uuid


class GameSession:
    def __init__(self, ll_model: ChatGPTController, cards_list: list):


        self.ll_model = ll_model
        self.id = str(uuid.uuid1())

        self.cards = {}

        for c in cards_list:
            self.cards[c['id']] = c

        self.current_title = ""

    def get_cards(self):

        return list(self.cards.values())

    def next_title(self):

        new_title = self.ll_model.get_response("Come up with a news title at any random theme. And just write it:")

        self.current_title = new_title
        self.modified_title = ""

        return new_title
    
    def apply_cards(self,selected_card_ids):

        if len(selected_card_ids)==0:
            self.modified_title = self.current_title

            return self.modified_title
            

        tt = "Modify this news title \""
        tt += self.current_title
        tt += "\" by apllying" 

        if len(selected_card_ids)>1:
            
            tt += "these cognitive biases: " 
            
            for c_id in selected_card_ids:
                tt += ", "+self.cards[c_id]["name"]
            
        else:
            tt += self.cards[selected_card_ids[0]]["name"]
            
            tt += " cognitive bias"
        

        tt += ":"

        self.modified_title = self.ll_model.get_response(tt)


        return self.modified_title
    
    def action_ignore(self):
        

        return self.next_title()
    

    def action_post(self):


        return self.next_title()

