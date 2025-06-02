import _ from "lodash";

const gptSystemPrompt = `
    You are an elite level SEO and copywriting expert.
    
    You will be given a JSON array representing all the text on a webpage. 
    If a node's string includes the word "lorem" (not case-insensitive), rewrite it with a relevant, SEO-friendly alternative
    that matches the flow of the page. 
    The string node might contain content that should be used to generate the replacement string.
    Consider the string elements that come before and after the string node.
    For example if the previous string node is a single line question, the replacement string should most likely be an answer.
    Try to match the original length of the string node, and maintain the page's overall context and tone.
    
    Important:
    - If no nodes contain "lorem", return the original JSON array unchanged.
    - Always return the **entire array** — even if you only modify a few nodes.
    - Do not omit, summarize, or condense the output. The output must remain a valid JSON array of the same structure.
    - Return your response as **raw JSON only** (no explanations, no markdown formatting).
    - Your copy writing should have no fluff or filler, and be concise and to the point. This is an example of fluff: "Introducing the third major benefit — Lastly, our third benefit promotes a stronger immune system, supporting overall health and preventing illness." This is how it should be written: "StrongerImmunity — Promote stronger immunity, support overall health and prevent illness."
    - Don't use overused terms like these in your copy writing: Firstly, Lastly, Moreover, Furthermore, However, Therefore, Additionally, Specifically, Generally, Consequently, Importantly, Similarly, Nonetheless, As a result, Indeed. Thus, Alternatively, Notably, As well as, Despite, Essentially.
    - Don't use colons or semicolons.
    - Don't list items like; "Benefit 1", "First Benefit", "Third Benefit", etc.
`;

async function ReplaceLorem(apiKey,userPrompt,setStatusMessage) {

    console.clear()
    setStatusMessage("Finding all text...")

    //custom log function
    const log = (...args) => {
        console.log("**********************************")
        console.log(...args)
    }
    
    //get all elements
    const allElements = await webflow.getAllElements();
    //for all text elements
    const allTextElementRefs = []
    const allTextElements = []

    log(allElements)

    //for all elements
    for(const el of allElements){

        //set the element (this allows more functions to be used)
        const selectedElement = await webflow.setSelectedElement(el)

        //check for string
        let string = null

        if(typeof selectedElement["getText"] === "function"){
            string = await selectedElement.getText()
            console.log(selectedElement.id.element,string)
        }

        //if string is found, add to array
        if(string){
            allTextElementRefs.push(selectedElement)
            allTextElements.push({
                element: selectedElement.id.element,
                string: string,
            })
        }
    }

    setStatusMessage("Waiting on ChatGPT...")
    log(allTextElements)
    log(JSON.stringify(allTextElements))

    //send to chatgpt
    const gptResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4-turbo", //"gpt-4o", //"gpt-3.5-turbo",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: gptSystemPrompt },
            { role: "user", content: userPrompt || "" },
            { role: "user", content: JSON.stringify({pageObject:allTextElements})},
          ]
        })
    })

    const data = await gptResponse.json()
    const dataObject = JSON.parse(data.choices[0].message.content).pageObject;
    
    //convert to {element:string}
    const gptDataKeyed = dataObject.reduce((acc, item) => {
        acc[item.element] = item.string;
        return acc;
    }, {});
    
    log(data)
    log(gptDataKeyed);
    setStatusMessage("Applying changes...")

    //for all text elements
    for(const el of allTextElementRefs){

        //set the element (this allows more functions to be used)
        const selectedElement = await webflow.setSelectedElement(el)

        //check for string
        let string = gptDataKeyed[selectedElement.id.element] || null

        console.log("... checking",selectedElement.id.element,string)

        if(string){
            if(typeof selectedElement["setText"] === "function"){
                await selectedElement.setText(string)
                console.log(selectedElement.id.element,string)
            }else{
                console.log("!!! no setText function for",selectedElement.id.element)

                if(typeof selectedElement["getText"] === "function")
                console.log("    But it has getText function")    

            }
        }

        //if string is found, add to array
        // if(string)
        // allTextElements.push({
        //     element: selectedElement.id.element,
        //     string: string,
        // })
    }

    setStatusMessage("")

    //notify user
    


  
}

export default ReplaceLorem