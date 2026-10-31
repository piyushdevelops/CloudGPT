const fs=require('fs'),path=require('path');
const root=__dirname;
function write(file,text){const out=path.join(root,'candidate',file);fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,text);}
function edit(file,change){write(file,change(fs.readFileSync(path.join(root,'before',file),'utf8')));}
function replace(s,a,b){if(!s.includes(a))throw Error('Missing anchor: '+a.slice(0,100));return s.replace(a,b);}
edit('assets/june-scoop-search.js',s=>{
 s=replace(s,"const products=data.resources?.results?.products||[];this.results.replaceChildren();",`const products=data.resources?.results?.products||[];
        const { hasKeywordMatches } = await import(this.dataset.matchesAsset);
        const matched = !products.length || await hasKeywordMatches(url, query, this.request.signal, products);
        if(sequence!==this.sequence||!this.active)return;
        this.results.replaceChildren();
        if(!products.length || !matched){
          const note=document.createElement('p');note.className='jss-all';note.textContent='No matching products found';this.results.append(note);
          if(products.length){const label=document.createElement('p');label.className='jss-all';label.textContent='You might also like';this.results.append(label);}
        }`);
 s=replace(s,"products.length?this.config.results_label:'No matching products found'","products.length&&matched?this.config.results_label:products.length?'No matching products found. You might also like these products.':'No matching products found'");
 s=replace(s,'this.appendViewAll(query);this.results.hidden=false;this.status.textContent=products.length&&matched',"this.appendViewAll(query);if(products.length&&!matched)this.results.lastElementChild.textContent='View suggestions →';this.results.hidden=false;this.status.textContent=products.length&&matched");
 return s;
});
edit('snippets/june-scoop-search.liquid',s=>replace(s,'<june-scoop-search data-header=',`<june-scoop-search data-matches-asset="{{ 'june-search-matches.js' | asset_url }}" data-header=`));
edit('sections/main-search.liquid',s=>{
 s=replace(s,'  data-search-performed="{{ search.performed }}"','  data-match-state="checking"\n  data-search-performed="{{ search.performed }}"');
 s=replace(s,'        this.ensureSearchParameters();','        this.ensureSearchParameters();\n        this.checkSearchMatches();');
 s=replace(s,'        this.requestController?.abort();\n        if (this.searchSuggestionOutsideHandler)', '        this.requestController?.abort();\n        this.matchController?.abort();\n        if (this.searchSuggestionOutsideHandler)');
 s=replace(s,'      parseSearchMap(jsonText) {',`      async checkSearchMatches() {
        if(this.dataset.searchPerformed !== 'true' || !this.dataset.searchQuery.trim()) {this.dataset.matchState='ready';return;}
        this.matchController?.abort();
        const controller=this.matchController=new AbortController();
        try {
          const {hasKeywordMatches}=await import({{ 'june-search-matches.js' | asset_url | json }});
          const matched=await hasKeywordMatches(this.dataset.predictiveUrl, this.normaliseSearchQuery(this.dataset.searchQuery), controller.signal);
          if(controller.signal.aborted || !this.isConnected) return;
          document.title=matched ? 'Search: '+this.dataset.searchQuery+' — The June Shop' : 'No matching products: '+this.dataset.searchQuery+' — The June Shop';
          if(!matched && this.grid?.querySelector('.tjs-product-card')) {
            const notice=document.createElement('div');notice.className='tjs-final-collection__empty';
            const heading=document.createElement('h2');heading.textContent='No matching products found';
            const label=document.createElement('p');label.textContent='You might also like';notice.append(heading,label);
            this.grid.prepend(notice);
            // These are Shopify's broader suggestions, not matching result counts or facets.
            this.querySelectorAll('.tjs-product-card').forEach((card,index)=>{if(index>=4)card.remove();});
            this.querySelectorAll('.tjs-final-collection__controls, .tjs-final-collection__load-wrap, [data-filter-drawer], [data-floating-type]').forEach(node=>node.hidden=true);
            this.announce('No matching products found. You might also like these products.');
            this.dataset.searchRecommendations='true';
          }
        } catch(error) {
          if(error.name!=='AbortError') this.announce('Unable to verify search matches. Please try again.');
        } finally {this.dataset.matchState='ready';}
      }

      parseSearchMap(jsonText) {`);
 s=replace(s,'          this.renderDynamicSearchSuggestions(panel, query, resources);',`          const {hasKeywordMatches}=await import({{ 'june-search-matches.js' | asset_url | json }});
          resources.juneRecommendations = (resources.products || []).length && !await hasKeywordMatches(endpoint, requestQuery, suggestionController.signal, resources.products || []);
          if(suggestionController.signal.aborted || root._tjsSuggestionController!==suggestionController || !root.isConnected || root.querySelector('[data-input-search]')?.value.trim()!==query.trim()) return;
          this.renderDynamicSearchSuggestions(panel, query, resources);`);
 s=replace(s,'<span class="tjs-search-suggest__dynamic-title">Products</span>',`<span class="tjs-search-suggest__dynamic-title">\${resources.juneRecommendations ? 'No matching products found — You might also like' : 'Products'}</span>`);
 s=replace(s,'{% schema %}',`<style>
  #TjsFinalSearch-{{ section.id }}:defined[data-match-state="checking"] .tjs-product-card { visibility:hidden; }
  #TjsFinalSearch-{{ section.id }}[data-search-recommendations="true"] [hidden] { display:none !important; }
</style>
{% schema %}`);
 return s;
});

