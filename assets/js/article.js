const escapeHtml=value=>value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const slugify=value=>value.trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu,'-').replace(/^-|-$/g,'');

function inlineMarkdown(value){return value.replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/\*([^*]+)\*/g,'<em>$1</em>').replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>')}
function renderMarkdown(source){
  const code=[];
  let text=escapeHtml(source).replace(/```([\w+-]*)\n([\s\S]*?)```/g,(_,lang,body)=>{const token=`%%CODE${code.length}%%`;code.push(`<pre><div class="code-head"><span>${lang||'text'}</span></div><code>${body.trimEnd()}</code></pre>`);return token});
  const lines=text.split(/\r?\n/),html=[];let list=null;
  const closeList=()=>{if(list){html.push(`</${list}>`);list=null}};
  for(const raw of lines){const line=raw.trimEnd();if(!line.trim()){closeList();continue}if(/^%%CODE\d+%%$/.test(line)){closeList();html.push(line);continue}const heading=line.match(/^(#{1,3})\s+(.+)$/);if(heading){closeList();const level=heading[1].length;const title=inlineMarkdown(heading[2]);const id=slugify(heading[2]);html.push(`<h${level} id="${id}">${title}</h${level}>`);continue}if(/^>\s?/.test(line)){closeList();html.push(`<blockquote>${inlineMarkdown(line.replace(/^>\s?/,''))}</blockquote>`);continue}const item=line.match(/^([-*]|\d+\.)\s+(.+)$/);if(item){const type=/\d/.test(item[1])?'ol':'ul';if(list!==type){closeList();html.push(`<${type}>`);list=type}html.push(`<li>${inlineMarkdown(item[2])}</li>`);continue}closeList();html.push(`<p>${inlineMarkdown(line)}</p>`)}closeList();
  return html.join('\n').replace(/%%CODE(\d+)%%/g,(_,index)=>code[Number(index)]);
}
async function loadArticle(){
  const slug=new URLSearchParams(location.search).get('slug');
  try{
    const posts=await fetch('content/posts.json',{cache:'no-store'}).then(response=>response.json());
    const post=posts.find(item=>item.slug===slug);if(!post)throw new Error('not found');
    const markdown=await fetch(post.file,{cache:'no-store'}).then(response=>{if(!response.ok)throw new Error('not found');return response.text()});
    document.title=`${post.title} · lumi 的成长实验室`;document.querySelector('meta[name="description"]').content=post.summary;
    document.querySelector('#article-title').textContent=post.title;document.querySelector('#article-summary').textContent=post.summary;
    document.querySelector('.article-category').textContent=post.category;
    document.querySelector('#article-meta').innerHTML=`<time>${post.date}</time><span>${post.readingTime||'阅读笔记'}</span>${(post.tags||[]).map(tag=>`<span># ${tag}</span>`).join('')}`;
    const body=document.querySelector('#article-body');body.innerHTML=renderMarkdown(markdown);
    const headings=[...body.querySelectorAll('h2,h3')];document.querySelector('#toc-list').innerHTML=headings.length?headings.map(item=>`<a class="toc-${item.tagName.toLowerCase()}" href="#${item.id}">${item.textContent}</a>`).join(''):'<span>这篇文章暂无分节。</span>';
  }catch(error){document.querySelector('#article-title').textContent='没有找到这篇文章';document.querySelector('#article-summary').textContent='链接可能已经失效，或者文章仍在整理。';document.querySelector('#article-body').innerHTML='<p><a href="index.html">返回首页查看其他内容 →</a></p>';document.querySelector('#toc-list').innerHTML='';}
}
window.addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;document.querySelector('.reading-progress i').style.width=`${max?scrollY/max*100:0}%`},{passive:true});
loadArticle();
