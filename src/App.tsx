import { ChangeEvent, useState} from "react";
import { cpp } from "@codemirror/lang-cpp";
import ReactCodeMirror from "@uiw/react-codemirror";
import "./App.css";

function App() {

  const SAMPLE_CODE = "// Type your code here\n#include <stdio.h>\nint main() {\n  printf(\"Hello, World!\");\n  return 0;\n}"

  const [code, setCode] = useState<string>(SAMPLE_CODE)

  const [inputArgs, setInputArgs] = useState({
    args: "",
    checked: false,
  });

  const [output, setOutput] = useState<string>("");

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const handleInputArgsChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value;
    if (e.target.type === "checkbox") {
      value = e.target.checked;
    } else {
      value = e.target.value;
    }
    setInputArgs({ ...inputArgs, [e.target.id]: value})
  };


  const handleSubmit = async () => {
    if (!inputArgs.checked && inputArgs.args) {
      alert("Command line arguments detected! Please check the checkbox or clear your arguments.");
    } else {
    setOutput("Running...");
    const compilerData = {
      "code": code,
      "args": inputArgs.args,
      "checked": inputArgs.checked
    };

    await fetch('http://localhost:5000/', {method: 'POST', body: JSON.stringify(compilerData), headers: {'Content-Type':'application/json'}})
      .then(res => 
        res.text()
      .then(output_data =>
        handleOutput(output_data)));
    }
  };


  const handleOutput = (output_data: string) => {
    setOutput(output_data);
  };


  const handleClear = () => {
    setOutput("");
  };

  return (
      <div className="App">
        <h1>Under The C</h1>
        <h1>Online Compiler</h1>
        <div className="row">
          <div className="column">
            <div className="tab-bar">
              <label className="tab-name">
                main.c
              </label>
              <button onClick={handleSubmit}>
                Run
              </button>
            </div>
            <ReactCodeMirror value={code} width="426px" height="471px" theme="dark" extensions={[cpp()]} onChange={handleCodeChange} />
            <br />
            <label >Command line arguments:</label>
            <br />
            <input type="text" id="args" name="args" value={inputArgs.args} size={50} onChange={handleInputArgsChange} placeholder="// Your arguments" />
            <input type="checkbox" id="checked" name="checked" onChange={handleInputArgsChange} value="1" />
          </div>
          <div className="column">
            <div className="tab-bar">
              <label className="tab-name">
                Output
              </label>
              <button onClick={handleClear}>
                Clear
              </button>
            </div>
          <textarea className="output" name="output" value={output}rows={30} cols={50} readOnly={true} placeholder="// Your output"></textarea>
          </div>
        </div>
      </div>
  )
}

export default App;
