from chatgpt_controller import ChatGPTController
import uuid


class GameSession:
    def __init__(self, ll_model: ChatGPTController, prompts : dict, cards_list: list, language: str):


        self.ll_model = ll_model
        self.prompts = prompts
        self.id = str(uuid.uuid1())


        self.lang = language

        self.cards = {}

        for c in cards_list:
            self.cards[c['id']] = c

        self.current_title = ""

    def get_cards(self):

        cards_data = []

        for c in self.cards.values():
            if c['include'] == '1':
                cards_data.append({'id': c['id'],'name' : c['name_'+self.lang]})

        return cards_data

    def next_title(self):

        new_title = self.ll_model.get_response(self.prompts['create_news_title'][self.lang])

        self.current_title = new_title
        self.modified_title = ""

        return new_title
    
    def apply_cards(self,selected_card_ids):

        if len(selected_card_ids)==0:
            self.modified_title = self.current_title

            return self.modified_title
            

        tt = self.prompts['apply_to_title'][self.lang].format(self.current_title)
        tt += " "

        if len(selected_card_ids)>1:
            
            tt += self.prompts['bias_multiple'][self.lang]+" "
            
            for c_id in selected_card_ids:
                tt += ", "+self.cards[c_id]["name_"+self.lang]
            
        else:
            tt += self.cards[selected_card_ids[0]]["name_"+self.lang]
            
            tt += " "+self.prompts['bias_single'][self.lang]
        

        tt += ":"

        self.modified_title = self.ll_model.get_response(tt)


        return self.modified_title
    
    def action_ignore(self):
        

        return self.next_title()
    

    def action_post(self):


        return self.next_title()

