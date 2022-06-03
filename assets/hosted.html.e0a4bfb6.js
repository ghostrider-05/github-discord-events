import{_ as e,o as t,c as a,e as d}from"./app.af27f823.js";const r={},h=d(`<h1 id="hosted-self-hosted" tabindex="-1"><a class="header-anchor" href="#hosted-self-hosted" aria-hidden="true">#</a> Hosted / self hosted</h1><ul><li>For how to deploy your own code, skip to the <a href="#self-hosted">self hosted</a> section</li></ul><h2 id="website" tabindex="-1"><a class="header-anchor" href="#website" aria-hidden="true">#</a> Website</h2><blockquote><p><strong>Warning</strong> The website and API is not publicly available / built yet</p></blockquote><p>You can manage your webhooks on <a href="">the website</a> by filling in the form.</p><h3 id="api" tabindex="-1"><a class="header-anchor" href="#api" aria-hidden="true">#</a> API</h3><h4 id="base-url" tabindex="-1"><a class="header-anchor" href="#base-url" aria-hidden="true">#</a> Base URL</h4><div class="language-txt ext-txt"><pre class="language-txt"><code>https://github-rules.ghostrider.workers.dev/api/v{api_version}
</code></pre></div><h4 id="version" tabindex="-1"><a class="header-anchor" href="#version" aria-hidden="true">#</a> Version</h4><table><thead><tr><th>Version</th><th>Status</th></tr></thead><tbody><tr><td>1</td><td>Available</td></tr></tbody></table><h4 id="post" tabindex="-1"><a class="header-anchor" href="#post" aria-hidden="true">#</a> POST <code>/</code></h4><p>Create a new webhook. Returns <code>200</code> with a new id on success.</p><p>JSON Params</p><table><thead><tr><th>Name</th><th>type</th><th>Required</th></tr></thead><tbody><tr><td>rules</td><td>GitHubEventRulesConfig</td><td>true</td></tr></tbody></table><h4 id="get" tabindex="-1"><a class="header-anchor" href="#get" aria-hidden="true">#</a> GET <code>/</code></h4><p>Query Params</p><table><thead><tr><th>Name</th><th>type</th><th>Required</th></tr></thead><tbody><tr><td>id</td><td>string</td><td>true</td></tr></tbody></table><h4 id="delete" tabindex="-1"><a class="header-anchor" href="#delete" aria-hidden="true">#</a> DELETE <code>/</code></h4><p>Query Params</p><table><thead><tr><th>Name</th><th>type</th><th>Required</th></tr></thead><tbody><tr><td>id</td><td>string</td><td>true</td></tr></tbody></table><h2 id="self-hosted" tabindex="-1"><a class="header-anchor" href="#self-hosted" aria-hidden="true">#</a> Self hosted</h2><p>// Add guide</p><h3 id="serverless" tabindex="-1"><a class="header-anchor" href="#serverless" aria-hidden="true">#</a> Serverless</h3><div class="custom-container tip"><p class="custom-container-title">Platforms</p><p>This guide is suitable for most platforms, including:</p><ul><li>CF workers</li><li>Vercel</li></ul></div><h3 id="node-js" tabindex="-1"><a class="header-anchor" href="#node-js" aria-hidden="true">#</a> Node.js</h3>`,25),s=[h];function i(o,n){return t(),a("div",null,s)}var c=e(r,[["render",i],["__file","hosted.html.vue"]]);export{c as default};