from openai import OpenAI


class ChatGPTController:
    def __init__(self, chatgpt_key: str, model: str):

        self.client = OpenAI(
            api_key=chatgpt_key,
        )



        self.model = model

        self.tokens_input = 0
        self.tokens_output = 0
        



    def get_response(self, prompt, system_message):
        print("__________________________________________________")
        print(prompt)
        response = self.client.chat.completions.create(
            model = self.model, 
            messages=[
                {"role" : "system","content" : system_message},
                {"role": "user", "content": prompt}
            ],
            temperature = 1.1
        )
        text_response = response.choices[0].message.content.strip()
        print(">>>")
        print(text_response)
        t_input = len(prompt.split(' ')+system_message.split(' '))
        t_output = len(text_response.split(' '))
        print("INPUT:",t_input,"OUTPUT:",t_output)
        self.tokens_input += t_input
        self.tokens_output += t_output
        print("TOTAL INPUT:",self.tokens_input,"TOTAL OUTPUT:",self.tokens_output)
        return text_response