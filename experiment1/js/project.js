// project.js - purpose and description here
// Author: Your Name
// Date:

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

// define a class
class MyProjectClass {
  // constructor function
  constructor(param1, param2) {
    // set properties using 'this' keyword
    this.property1 = param1;
    this.property2 = param2;
  }
}

function main() {
  const fillers = {
    greeting: ["Hello there", "Good day", "こんにちわ", "Hi"],
    action: ["cooking", "model-kit-building", "painting", "writing"],
    conflict: ["hard", "expensive", "difficult", "impossible", "time consuming"],
    celebrity: ["Michael from Michael's", "Pablo Picasso", "Wes Modes", "Jason Derulo"],
    goodbye: ["Bye now", "じゃあまた", "Hope to see you soon", "Best regards"],
    
  };
  
  const action_cache = fillers.action[Math.floor((fillers.action.length)*Math.random())]
  const template = `$greeting!
  
  I heard you like `+ action_cache +`, I like `+ action_cache +` too!\n 
  Unfortunately, it can sometimes feel $conflict. That's why Mike's emporium of Arts is here to help all your\n
  `+ action_cache +` needs! Trusted by people like $celebrity, we pride ourselves on quality assurance!\n
  We'll price match the competition everytime!\n
  \n
  $goodbye!
  `;
  
  
  // STUDENTS: You don't need to edit code below this line.
  
  const slotPattern = /\$(\w+)/;
  
  
  function replacer(match, name) {
    let options = fillers[name];
    if (options) {
      return options[Math.floor(Math.random() * options.length)];
    } else {
      return `<UNKNOWN:${name}>`;
    }
  }
  
  function generate() {
    let story = template;
    while (story.match(slotPattern)) {
      story = story.replace(slotPattern, replacer);
    }
  
    /* global box */
    $("#box").text(story);
    console.log("generated");
  }
  
  $("#clicker").click(generate);

  generate();
}



// let's get this party started - uncomment me
main();