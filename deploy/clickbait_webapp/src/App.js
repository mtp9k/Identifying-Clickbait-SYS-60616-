import logo from './logo.svg';
import './App.css';
import axios from 'axios'
import {useEffect,useState} from "react"

const CLICKBAIT_EXAMPLES=[
  'Which TV Female Friend Group Do You Belong In',
  'An Artist Drew Disney Men As Justin Bieber And The Outcome Is Glorious',
  '2 Somali-Americans Charged With Aiding Terror',
  'With Troubled Coyotes, Gretzky Called On as Savior Again',
  '21 Dogs Who Are Thankful For Their Best Friends',
  'Obama Welcomes Specter to the Party',
  "I'm An Atheist But I'm Not"
]

const api_request = async (instances,callback) =>{
  return axios.get(`https://spwe9p1ih9.execute-api.us-east-1.amazonaws.com/api/query`, {
     params: {instances:instances.join(',')}
    })
    .then(response=> {
      callback(response.data.response)
      })
// Mostly the same, I was just experimenting with different approaches, tried link.click, iframe and other solutions
    }

const makeArticles = (articles,articleClickbait)=>{
  console.log(articleClickbait)
  return articles.map((article,i)=><div style={{padding:10,marginTop:10,marginBottom:10, borderStyle:'solid',borderWidth:1,borderColor:'#e3e3e3'}}>
    <div style={{fontWeight:'bold',fontSize:22,color: articleClickbait?.[i] > 0.5 ? "red" : 'black'}}> {article}</div>
   {articleClickbait?.[i] ? <div style={{fontSize:14,color: articleClickbait?.[i] > 0.5 ? "red" : 'green'}} >{articleClickbait?.[i]}% chance of Clickbait</div> : <div/>}
    <div style={{opacity: 0.6}}>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi rutrum, ipsum nec vulputate porttitor, urna turpis tristique ante, nec molestie turpis orci non est. Cras rutrum eros at hendrerit aliquam. Maecenas consectetur scelerisque enim. Proin eu varius justo. Sed eleifend, ipsum eget commodo mattis, velit enim porttitor arcu, nec finibus eros orci sed ex. Etiam egestas, libero ornare gravida mattis, mauris neque iaculis leo, eget dignissim tortor mi bibendum lacus. Sed ut metus sed orci cursus vestibulum. Vestibulum molestie arcu non magna blandit fermentum. Nullam eu felis viverra urna eleifend finibus finibus ut orci. Quisque tempus dui est, a dapibus orci dictum interdum. Ut magna nibh, feugiat at magna vitae, convallis suscipit enim. Ut tincidunt nibh a aliquam pulvinar. Aliquam et libero neque. Aliquam commodo neque at ipsum posuere consequat.
    </div>
  </div>)
}
function App() {
  const [text,setText] = useState('')
  const [articleClickbait,setArticleClickbait] = useState([])
  const [inputClickbait,setInputClickbait] = useState([])
  useEffect(()=>api_request(CLICKBAIT_EXAMPLES,setArticleClickbait),[])
  return (
    <div style={{margin:20}}>
        <div style={{textAlign:'center', fontSize: 22,fontWeight:'bold'}}>Clickbait Detector</div>
        <div style={{display:'flex',flexDirection:'Row',justifyContent:'center',alignItems:'center',margin: 20}}>
          <input style={{minWidth:400}} placeholder={"Enter Clickbait Headline"} onChange={e=>setText(e.target.value)} value={text}></input>
          <div onClick={()=>api_request([text],setInputClickbait)} style={{cursor:'pointer',backgroundColor:'black', color:'white', borderRadius: 25,marginLeft:20,padding:10}}> Submit</div>
        </div>
       {inputClickbait.length ? <div style={{textAlign:'center'}}>Clickbait Probability: {inputClickbait[0]}</div> : <div/>}
      <div style={{textAlign:'center', fontSize: 22,fontWeight:'bold',margin:20}}>Real-life example</div>
    <div style={{margin:20}}>
{makeArticles(CLICKBAIT_EXAMPLES,articleClickbait)}
    </div>
    </div>
  );
}

export default App;
