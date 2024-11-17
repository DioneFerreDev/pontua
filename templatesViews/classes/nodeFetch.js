


class nodeFetch {
    constructor(url, options = null) {
        this.url = url;
        this.options = options        
    }
    async manageFetch() {
        if (this.options == null)
            return await this.simpleFetch()
        else
            return await this.optionFetch()
    }
    
    async simpleFetch() {
        try {
            const response = await fetch(this.url)
            if (!response.ok) throw new Error(response.statusText)

            const contentType = response.headers.get("Content-Type");            
            if (contentType.includes('application/json')) return await response.json();
            if (contentType.includes('text/plan')) return await response.text();
            return response.statusText;
        } catch (error) { throw error }
    }
    async optionFetch() {
        try {
            const response = await fetch(this.url,this.options)
            if (!response.ok) throw new Error(response.statusText)

            const contentType = response.headers.get("Content-Type");            
            if (contentType.includes('application/json')) return await response.json();
            if (contentType.includes('text/plan')) return await response.text();
            return response.statusText;
        } catch (error) { throw error }       
    }

}







module.exports = nodeFetch;