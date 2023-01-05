function getCacheBuster() { /* NOTE: sometimes this might result in a different resource */
        return '?' + btoa(Math.random())
}


async function getFetchRateUncached(url) {
        return getFetchRate(url + getCacheBuster())
}


async function getFetchRate(url) { /* NOTE: this will not work for strict CSPs preventing connections to external websites */

        const metrics = {
                time: {
                        start: Date.now()
                }
        }

        const response = await fetch(url, { mode: 'no-cors' })

        metrics.time.end = Date.now()
        metrics.time.elapsed = Math.max(0, metrics.time.end - metrics.time.start)
        metrics.length = response.headers.get('content-length')

        return metrics
}


async function isCached(url) {
        const cachedTime = (await getFetchRate(url)).time.elapsed
        const uncachedTime = (await getFetchRateUncached(url)).time.elapsed

        if (Math.abs(cachedTime - uncachedTime) > 100) { /* NOTE: this should be estimated based on internet speed */
                return true
        }

        return false
}
