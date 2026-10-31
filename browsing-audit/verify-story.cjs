const fs=require('fs'),assert=require('node:assert/strict');
const text=fs.readFileSync(__dirname+'/theme/sections/june-other-chapters.liquid','utf8');
const body=text.match(/ setup\(\)\{([\s\S]*?)\}\n render\(\)/)[1];
const setup=new Function('innerWidth','innerHeight','getComputedStyle',body);
const results=[];
for(const [w,h,reduced] of [[1440,1000,false],[375,667,false],[393,852,false],[430,932,false],[393,852,true],[852,393,false]]){
 const styles={},scene={inert:true,removeAttribute(){this.visible=true}};
 const root={dataset:{scroll:'true',motion:'true',pace:'32',paceMobile:'19',blank:'18',blankMobile:'10'},reduced:{matches:reduced},style:{setProperty(k,v){styles[k]=v}},scenes:[scene],render(){this.rendered=true}};
 setup.call(root,w,h,()=>({getPropertyValue(){return '85'}}));
 assert.equal(root.pinned,!reduced&&h>=480);
 assert.ok(root.durations[0]*root.unit<=h*(w<=900?.12:.2));
 assert.equal(root.durations.length,10);
 if(!root.pinned)assert.equal(scene.inert,false);
 results.push({viewport:[w,h],reduced,pinned:root.pinned,height:Number((root.distance+root.height).toFixed(2)),blank:Number((root.durations[0]*root.unit).toFixed(2))});
}
fs.writeFileSync(__dirname+'/story-math-checks.json',JSON.stringify(results,null,2));console.log(results);
