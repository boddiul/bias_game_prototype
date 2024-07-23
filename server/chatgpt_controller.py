import openai


class ChatGPTController:
    def __init__(self, chatgpt_key: str, model: str):

        openai.api_key = chatgpt_key
        self.model = model
        



    def get_response(self, prompt):
        print("__________________________________________________")
        print(prompt)
        response = openai.ChatCompletion.create(
            model = self.model, 
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature = 1
        )
        text_response = response.choices[0].message.content.strip()
        print(text_response)
        return text_response