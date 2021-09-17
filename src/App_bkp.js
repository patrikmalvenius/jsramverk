import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';



class SaveDoc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      docNameSave: '',
    };
  }

  onChange(value) {
    this.setState({docNameSave: value});
  }

  render() {

    return (
      <form>
        <input type="text" value={this.state.docNameSave} onChange={(e) => this.onChange(e.target.value)}/>
        <p>
          Vad ska dokumentet heta?
        </p>
        <button type="submit" onClick=  {(e) => {e.preventDefault(); this.props.handleSaveClick(this.state.docNameSave)}}>Spara</button>    
      </form>
    );
  }
}

class LoadDoc extends React.Component {
  render() {

    return (
      <form >
        <select>
          <option value="docEtt">docEtt</option>
          <option value="docTva">docTva</option>
      </select>
        <p>
          Välj dokument att ladda från drop-down ovan!
        </p>
        <button type="submit">Ladda</button>    
      </form>
    );
  }
}


class ControlPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      docName: '',
      docList: '',
    };
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.handleLoadClick = this.handleLoadClick.bind(this);
  }
// stoppa in koden från savbuttonpost i denna funktionen
// sen lite om this i callbacks: https://reactjs.org/docs/handling-events.html
  handleSaveClick(value) {
    this.setState({docName: value});
    this.props.save(value);
  }


  handleLoadClick(name) {
    this.setState({docName: name});
  }

  render() {
    return (
      <div>
        <SaveDoc handleSaveClick={this.handleSaveClick}/>
        <LoadDoc docName={this.state.docName}  value={this.props.value}  handleLoadClick={() => this.handleLoadClick()}/>
      </div>
    )
  }
  }

export default function App() {
  const editorRef = useRef(null);
  //const [dirty, setDirty] = useState(false);

  //useEffect(() => setDirty(false), [initialValue]);
  const save = (name) => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      //setDirty(false);
      //editorRef.current.setDirty(false);
      fetch("https://jsramverk-editor-paml20.azurewebsites.net", {
        body: JSON.stringify({name: name, document: content}),
        headers: {
        'content-type': 'application/json'
        },
        method: 'POST'
        })
        .then(function (response) {
              console.log(content);
            })
      console.log("CONTENT I CONST SAVE I EXPORT DEFAULT APP")
      console.log(content);
    }
  };
  return (
    
    <div>
      <div>
         <ControlPanel save={save}/>
      </div>
      <Editor tinymceScriptSrc={process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'}

        onInit={(evt, editor) => editorRef.current = editor}
        initialValue="<p>This is the initial content of the editor.</p>"
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
          ],
          toolbar: 'undo redo | formatselect | ' +
          'bold italic backcolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
      />

      </div>
  );
}
/*
function MyComponent({initialValue}) {
  const editorRef = useRef(null);
  const [dirty, setDirty] = useState(false);
  useEffect(() => setDirty(false), [initialValue]);
  const save = () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      setDirty(false);
      editorRef.current.setDirty(false);
      // an application would save the editor content to the server here
      console.log(content);
    }
  };
  return (
    <>
      <Editor
        initialValue={initialValue}
        onInit={(evt, editor) => editorRef.current = editor}
        onDirty={() => setDirty(true)}
      />
      <button onClick={save} disabled={!dirty}>Save</button>
      {dirty && <p>You have unsaved content!</p>}
    </>
  );
}*/
