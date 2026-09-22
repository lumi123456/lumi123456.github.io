document.addEventListener('DOMContentLoaded',async()=>{
  let posts=[];
  try{const response=await fetch('content/posts.json',{cache:'no-store'});posts=await response.json()}catch(error){return}
  document.querySelectorAll('[data-category-list]').forEach(container=>{
    const categories=container.dataset.categoryList.split(',').map(item=>item.trim());
    const matched=posts.filter(post=>categories.includes(post.category));
    if(matched.length){container.innerHTML=matched.map(post=>`<a href="article.html?slug=${encodeURIComponent(post.slug)}"><span>${post.title}</span><small>${post.date}</small></a>`).join('')}
  });
  const cloud=document.querySelector('#tag-cloud');
  const list=document.querySelector('#tag-post-list');
  if(!cloud||!list)return;
  const tags=[...new Set(posts.flatMap(post=>post.tags||[]))].sort((a,b)=>a.localeCompare(b,'zh-CN'));
  const renderPosts=(items,title='全部文章')=>{
    document.querySelector('#tag-result-title').textContent=title;
    document.querySelector('#tag-result-count').textContent=`${items.length} 篇`;
    list.innerHTML=items.length?items.map(post=>`<a class="post-card" href="article.html?slug=${encodeURIComponent(post.slug)}"><time class="post-date">${post.date.replaceAll('-','.')}</time><div><h3>${post.title}</h3><p>${post.summary}</p><div class="post-meta"><span class="chip">${post.category}</span></div></div><span class="post-go">↗</span></a>`).join(''):'<div class="loading-card">这个标签下暂时没有文章。</div>';
  };
  cloud.innerHTML=tags.length?`<button class="tag-button is-active" data-tag="">全部</button>${tags.map(tag=>`<button class="tag-button" data-tag="${tag}"># ${tag}</button>`).join('')}`:'<span class="loading-card">标签会在文章发布后出现在这里。</span>';
  cloud.addEventListener('click',event=>{const button=event.target.closest('.tag-button');if(!button)return;document.querySelectorAll('.tag-button').forEach(item=>item.classList.remove('is-active'));button.classList.add('is-active');const tag=button.dataset.tag;renderPosts(tag?posts.filter(post=>(post.tags||[]).includes(tag)):posts,tag?`# ${tag}`:'全部文章')});
  renderPosts(posts);
});
