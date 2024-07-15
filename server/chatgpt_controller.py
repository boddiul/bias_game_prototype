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
            ]
        )
        print(response)
        return response.choices[0].message.content.strip()