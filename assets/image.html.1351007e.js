import{_ as n,o as s,c as a,e as t}from"./app.af27f823.js";const e={},p=t(`<h1 id="issue-image" tabindex="-1"><a class="header-anchor" href="#issue-image" aria-hidden="true">#</a> Issue image</h1><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> 
    GitHubEventManager<span class="token punctuation">,</span> 
    DiscordWebhookEmbed<span class="token punctuation">,</span> 
    RuleBuilder 
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;github-discord-events&#39;</span>

<span class="token keyword">const</span> rules <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">RuleBuilder</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token literal-property property">url</span><span class="token operator">:</span> <span class="token string">&#39;webhook_url&#39;</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">addEvent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">&#39;issues&#39;</span><span class="token punctuation">,</span>
        <span class="token literal-property property">actions</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;opened&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token comment">// Adds an image to the embed on a new commit</span>
        <span class="token function-variable function">transformEmbed</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter">event<span class="token punctuation">,</span> embeds</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
            <span class="token keyword">const</span> <span class="token punctuation">{</span> repository<span class="token punctuation">,</span> issue <span class="token punctuation">}</span> <span class="token operator">=</span> event
            <span class="token keyword">const</span> image <span class="token operator">=</span> DiscordWebhookEmbed<span class="token punctuation">.</span><span class="token function">embedImage</span><span class="token punctuation">(</span>
                <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>repository<span class="token punctuation">.</span>full_name<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">/issues/</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>issue<span class="token punctuation">.</span>number<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span>
            <span class="token punctuation">)</span>

            <span class="token keyword">const</span> embed <span class="token operator">=</span> embeds<span class="token operator">?.</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">??</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

            <span class="token keyword">return</span> <span class="token punctuation">[</span><span class="token punctuation">{</span>
                <span class="token literal-property property">image</span><span class="token operator">:</span> <span class="token punctuation">{</span>
                    <span class="token literal-property property">url</span><span class="token operator">:</span> image
                <span class="token punctuation">}</span><span class="token punctuation">,</span>
                <span class="token operator">...</span>embed
            <span class="token punctuation">}</span><span class="token punctuation">]</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token comment">// Only apply it on the main branch</span>
        <span class="token literal-property property">branches</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;main&#39;</span><span class="token punctuation">]</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>

<span class="token keyword">const</span> manager <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">GitHubEventManager</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    rules
<span class="token punctuation">}</span><span class="token punctuation">)</span>

<span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">&#39;fetch&#39;</span><span class="token punctuation">,</span> <span class="token parameter">event</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    event<span class="token punctuation">.</span><span class="token function">respondWith</span><span class="token punctuation">(</span>manager<span class="token punctuation">.</span><span class="token function">handleEvent</span><span class="token punctuation">(</span>event<span class="token punctuation">.</span>request<span class="token punctuation">)</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2),o=[p];function c(i,l){return s(),a("div",null,o)}var r=n(e,[["render",c],["__file","image.html.vue"]]);export{r as default};
