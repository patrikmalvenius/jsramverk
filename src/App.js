import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';



class SaveDoc extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.props.onChange(e.target.value);
  }

  handleSubmit(e) {

    e.preventDefault();
    this.props.onSubmit();
  }

  render() {
  const newDocName = this.props.newDocName;
    return (
      <form onSubmit = {this.handleSubmit}>
        <input type="text" value={newDocName} onChange={this.handleChange} />
        <p>
          Vad ska dokumentet heta?
        </p>
        <button type="submit" >Spara</button>    
      </form>
    );
  }
}

class UpdateDoc extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.props.onChange(e.target.value);
  }

  handleSubmit(e) {

    e.preventDefault();
    this.props.onSubmit();
  }

  render() {
  const docName = this.props.docName;
    return (
      <form onSubmit = {this.handleSubmit}>
        <input type="text" value={docName} onChange={this.handleChange} />
        <button type="submit" >Spara uppdaterat dokument</button>    
      </form>
    );
  }
}

class LoadDoc extends React.Component {
  constructor(props) {
    super(props);
    //this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      data: "",
    }
  }

  componentDidMount() {
    fetch("https://jsramverk-editor-paml20.azurewebsites.net", {
      headers: {
      'content-type': 'application/json'
      },
      method: 'GET'
      })
      .then(res => res.json())
      .then(json => this.setState({ data: json }));
      console.log(this.state.data);
  }

  handleChange(e) {
    this.props.onChange(e.target.value);
  }

  handleSubmit(e) {
    e.preventDefault();

    this.props.onSubmit();
  }
  render() {
    const docs = Object.values(this.state.data);
    const doc = docs.map((doc) =>
    <option key={doc._id.toString()} id={doc._id}>
      {doc.name}
    </option>)
  

    return (
      <form onSubmit={this.handleSubmit}>
        <select onChange={this.handleChange}>
          {doc}
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
      docId: '',
      newDocName: '',
      docList: '',
    };
    this.handleSaveSubmit = this.handleSaveSubmit.bind(this);
    this.handleLoadSubmit = this.handleLoadSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSaveChange = this.onSaveChange.bind(this);
  }

  handleSaveSubmit() {
    console.log("handlesavesubmit");
    const value = this.state.newDocName;
    this.props.save(value);
  }

  handleUpdateSubmit() {
    console.log("handlesavesubmit");
    const value = this.state.docName;
    const _id = this.state.docId;
    this.props.update(value, _id);
  }

  onSaveChange(value) {
    this.setState({newDocName: value});
  }

  onChange(name, id) {
    this.setState({docName: name, docId: id});
  }

  handleLoadSubmit(){
    //this.setState({docName: name});
    this.props.load(this.state.docName);

    //this.props.loadAll();
  }

  render() {
    const docName = this.state.docName;
    return (
      <div>
        <SaveDoc onChange={this.onSaveChange} onSubmit={this.handleSaveSubmit} newDocName={this.state.newDocName}/>
        <LoadDoc docName={this.state.docName}  onChange={this.onChange} value={this.props.value}  onSubmit={() => this.handleLoadSubmit()}/>
        <UpdateDoc onChange={this.onChange} onSubmit={this.handleUpdateSubmit} docName={docName}/>
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
              console.log(response.json());
            })
    }
  };

  const update = (id, name) => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      //setDirty(false);
      //editorRef.current.setDirty(false);
      fetch("https://jsramverk-editor-paml20.azurewebsites.net/update", {
        body: JSON.stringify({_id: id, name: name, document: content}),
        headers: {
        'content-type': 'application/json'
        },
        method: 'POST'
        })
        .then(function (response) {
              console.log(response.json());
            })
    }
  };

  const load = (name) => {
    if (editorRef.current) {
      //const content = editorRef.current.getContent();
      //setDirty(false);
      //editorRef.current.setDirty(false);
      fetch("https://jsramverk-editor-paml20.azurewebsites.net/oneDoc", {
        body: JSON.stringify({name: name}),
        headers: {
        'content-type': 'application/json'
        },
        method: 'POST'
        })
        .then(res => res.json())
        .then(json => console.log(json))
        .then(console.log(name));
    }
  };

  return (
    
    <div>
      <div>
         <ControlPanel save={save} load={load} update={update}/>
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
