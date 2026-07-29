const fs = require("fs");
const path = require("path");
const POSTS_DIR = path.join(process.cwd(), "content");
const posts = [];

const files = fs.readdirSync(POSTS_DIR).filter(file => file.toLowerCase().endsWith(".md"));

for (const file of files) {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file),"utf8");
    const front = raw.match(/^---\s*\n([\s\S]*?)\n---/);
    const post = {file,slug: file.replace(/\.md$/i, ""),title: file.replace(/\.md$/i, ""),date: "",tags: []};

    if(front){
        const meta = front[1];
        meta.split("\n").forEach(line=>{
            const [key,...rest]=line.split(":");
            if(!key)return;
            const value=rest.join(":").trim();
            switch(key.trim()){
                case "slug":post.slug=value;break;
                case "title":post.title=value;break;
                case "date":post.date=value;break;
                case "tags":post.tags=value.split(",").map(x=>x.trim()).filter(Boolean);break;
            }
        });
    }
    posts.push(post);
}

posts.sort((a,b)=>b.date.localeCompare(a.date));
fs.writeFileSync("posts.json",JSON.stringify({updated:new Date().toISOString(),posts},null,2));
console.log("posts.json generated");