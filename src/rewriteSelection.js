import _ from "lodash";

const gptSystemPrompt = `
    You are an elite level SEO and copywriting expert. The character archetype voice is sage/caregiver.
    
    You will be given a string of text that represents notes or examples on how the copy for this section should be completed. 
    Using the user prompt, reply with at least five options that fill in and/or complete the string with the new expert copy that matches the archetype voice.

    The reply json should be in the following format:
    {"options": [
        "option1",
        "option2",
        "option3"
    ]}

    Important:
    - Return your response as **string only**.
    - Your copy writing should have no fluff or filler, and be concise and to the point. This is an example of fluff: "Introducing the third major benefit — Lastly, our third benefit promotes a stronger immune system, supporting overall health and preventing illness." This is how it should be written: "StrongerImmunity — Promote stronger immunity, support overall health and prevent illness."
    - Don't use overused terms like these in your copy writing: Firstly, Lastly, Moreover, Furthermore, However, Therefore, Additionally, Specifically, Generally, Consequently, Importantly, Similarly, Nonetheless, As a result, Indeed. Thus, Alternatively, Notably, As well as, Despite, Essentially.
    - Don't use colons or semicolons, or the "—" symbol.
    - Don't list items like; "Benefit 1", "First Benefit", "Third Benefit", etc.
    - Do not start sentences with "Discover", "Imagine", "Unlock", "Transform"
`;

async function rewriteSelection(apiKey,userPrompt,setStatusMessage,setModalOptions) {

    console.clear()
    setStatusMessage("Finding all text...")

    //custom log function
    const log = (...args) => {
        console.log("**********************************")
        console.log(...args)
    }

    //set the element (this allows more functions to be used)
    const selectedElement = await webflow.getSelectedElement();

    //check for string
    let string = ""
    let stringElement = null

    if (selectedElement?.textContent && selectedElement?.children) {

        // Get Child Elements
        const children = await selectedElement.getChildren();
        console.log(selectedElement)
        console.log(children)

        if(children){
            // string = await selectedElement.getText()
            console.log(selectedElement.id.element,string)

             // Filter string elements from children
            const strings = children.filter(child => child.type === "String");
            // Initialize an array to hold text content
            
            // Loop over string elements to get text
            for (const myString of strings) {
                if (myString.type === "String") {
                    const text = await myString.getText();
                    string += text;

                    stringElement = myString
                }
            }

        }else{
            console.log("!!! no getText function for",selectedElement)
            throw new Error("No text found (er1a)",selectedElement)
        }

    }else{
        console.log("!!! no textContent or children for",selectedElement)
        throw new Error("No textContent or children for selected element (er1b)",selectedElement)
    }

    setStatusMessage("Waiting on ChatGPT...")
    log(string)

    //send to chatgpt
    const gptResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4-turbo", //"gpt-4o", //"gpt-3.5-turbo",
          response_format: { type: "json_object" }, //"json_object"
          messages: [
            { role: "system", content: gptSystemPrompt },
            { role: "user", content: userPrompt || "" },
            { role: "user", content: string},
          ]
        })
    })

    const data = await gptResponse.json()
    const dataObject = data.choices[0].message.content
    const options = JSON.parse(dataObject).options

    setModalOptions(options, (option) => {
        stringElement.setText(option)
    })

    log(data)
    setStatusMessage("Applying changes...")

    // await stringElement.setText(dataObject)
    // console.log(selectedElement.id.element,string)
       

    setStatusMessage("")

    //notify user
    


  
}

export default rewriteSelection