from chatgpt_controller import ChatGPTController
import uuid
import random



class GameSessionCompass:
    def __init__(self, ll_model: ChatGPTController, prompts : dict, cards_list: list, themes : dict, language: str):


        self.ll_model = ll_model
        self.prompts = prompts
        self.id = str(uuid.uuid1())


        self.lang = language

        self.themes_list = []
        for t in themes.values():
            self.themes_list.append(t[self.lang])

        self.cards = {}

        for c in cards_list:
            self.cards[c['id']] = c


        self.titles = []

        self.current_title = None

        self.left_right = 0
        self.world_tension = 0



    def action(self,action_type,action_data):

        
        if action_type == "get_cards":
            cards = self.get_cards()
            return {"cards": cards}
        elif action_type == "start":
            next_title, themes = self.next_title()
            return {"next_title": next_title, "themes": themes}
        elif action_type == "apply_cards":

            selected_card_ids = action_data["selected_card_ids"]

            modified_title = self.apply_cards(selected_card_ids)

            return {"modified_title": modified_title}
        
        elif action_type == "action_ignore":
            next_title, themes = self.action_ignore()
            return {"next_title": next_title, "themes": themes}
        elif action_type == "action_post":
            next_title, themes = self.action_post()
            return {"next_title": next_title, "themes": themes}
        elif action_type == "stats":
            return {"left_right": self.left_right, "world_tension": self.world_tension}
        



    def get_cards(self):

        cards_data = []

        for c in self.cards.values():
            if c['include'] == '1':
                cards_data.append({'id': c['id'],'name' : c['name_'+self.lang]})

        return cards_data

    def next_title(self):


        selected_themes = random.sample(self.themes_list, random.randint(1, 2))


        previous_titles = [title for title in self.titles if any(elem in selected_themes for elem in title["themes"])]
        previous_titles = previous_titles[-5:]
        
        prompt = self.titles_to_prompt(previous_titles)


        if len(selected_themes)==1:
            prompt += self.prompts['g0_news_title_theme_single'][self.lang]
        else:
            prompt += self.prompts['g0_news_title_theme_multiple'][self.lang]

        prompt += " " + ", ".join(selected_themes) +".\n"


        if len(previous_titles) > 0:
            if len(selected_themes)==1:
                prompt += self.prompts['g0_title_history_theme_single'][self.lang]
            else:
                prompt += self.prompts['g0_title_history_theme_multiple'][self.lang]
            
            prompt += " "+self.prompts['g0_news_title_theme_prev_description'][self.lang]

        prompt += self.prompts['g0_news_title_neutral_task'][self.lang]

        new_title = self.ll_model.get_response(prompt,self.prompts['g1_main_instructions'][self.lang])

        new_title = new_title.strip('"')
        self.current_title = {
            "original_text" : new_title,
            "modified_text" : None,
            "themes" : selected_themes,
            "posted" : False,
            "used_cards" : [],
            "player_action_description" : None,
            "consequence_description" : None,
        }

        return new_title
    
    def apply_cards(self,selected_card_ids):

        self.current_title["used_cards"] = selected_card_ids

        if len(selected_card_ids)==0:
            self.current_title["modified_text"] = None

            return self.current_title["original_text"]
            

        tt = self.prompts['g0_apply_to_title1'][self.lang].format(self.current_title["original_text"])
        tt += " "


        
        if len(selected_card_ids)>1:
            
            tt += self.prompts['g0_bias_multiple'][self.lang]+"\n"
            
            
        else:
            
            tt += self.prompts['g0_bias_single'][self.lang] + "\n"

        for c_id in selected_card_ids:
                
            tt += self.cards[c_id]["name_"+self.lang] + " ("+self.cards[c_id]["prompt_"+self.lang]+")\n"
            
        tt += self.prompts['g0_apply_to_title2'][self.lang]


        title = self.ll_model.get_response(tt,self.prompts['g1_main_instructions'][self.lang])
        title = title.strip('"')
        
        self.current_title["modified_text"] = title


        return self.current_title["modified_text"]
    
    def action_ignore(self):

        self.current_title["modified_text"] = None
        self.current_title["used_cards"] = []
        
        self.current_title["player_action_description"] = self.prompts['g0_player_action_ignore'][self.lang]

        self.compute_consequence()

        return self.next_title()
    

    def action_post(self):

        self.current_title["posted"] = True

        if self.current_title["modified_text"] == None:
            self.current_title["player_action_description"] = self.prompts['g0_player_action_original'][self.lang]
        else:
            self.current_title["player_action_description"] = self.prompts['g0_player_action_modify'][self.lang] +" (" +", ".join(map(lambda n: self.cards[n]["name_"+self.lang], self.current_title["used_cards"]))+ ")"

        self.compute_consequence()

        return self.next_title()
    
    def compute_consequence(self):


        previous_titles = [title for title in self.titles if any(elem in self.current_title["themes"] for elem in title["themes"])]
        previous_titles = previous_titles[-5:]
        prompt = self.titles_to_prompt(previous_titles)


        if len(previous_titles)>0:
            if len(self.current_title["themes"])==1:
                prompt += self.prompts['g0_title_history_theme_single'][self.lang]
            else:
                prompt += self.prompts['g0_title_history_theme_multiple'][self.lang]
        
        
        prompt += self.prompts['g0_compute_consequence1'][self.lang] + " "+self.current_title["original_text"] + "\n"
        
        
        prompt += self.current_title['player_action_description'] 
        
        if self.current_title["posted"] and len(self.current_title["used_cards"]):
            prompt += ": "+self.current_title["modified_text"]+"\n"
        else:
            prompt += "\n"


        prompt += self.prompts['g0_compute_consequence2'][self.lang]

        consequence = self.ll_model.get_response(prompt,self.prompts['g1_main_instructions'][self.lang])

        self.current_title['consequence_description'] = consequence

        self.titles.append(self.current_title)

        self.current_title = None


    def titles_to_prompt(self,titles):

        
        prompt = ""

        for title in titles:
            prompt += title["original_text"] + "\n"
            prompt += title["player_action_description"]
            
            if title["posted"] and len(title["used_cards"]):
                prompt += ": "+title["modified_text"]+"\n"
            else:
                prompt += "\n"

            prompt += title["consequence_description"] + "\n"
            prompt += "\n"

        return prompt
    
