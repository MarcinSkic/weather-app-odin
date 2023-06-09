(function () {
    const r = document.createElement("link").relList;
    if (r && r.supports && r.supports("modulepreload")) return;
    for (const e of document.querySelectorAll('link[rel="modulepreload"]'))
        c(e);
    new MutationObserver((e) => {
        for (const t of e)
            if (t.type === "childList")
                for (const s of t.addedNodes)
                    s.tagName === "LINK" && s.rel === "modulepreload" && c(s);
    }).observe(document, { childList: !0, subtree: !0 });
    function i(e) {
        const t = {};
        return (
            e.integrity && (t.integrity = e.integrity),
            e.referrerPolicy && (t.referrerPolicy = e.referrerPolicy),
            e.crossOrigin === "use-credentials"
                ? (t.credentials = "include")
                : e.crossOrigin === "anonymous"
                ? (t.credentials = "omit")
                : (t.credentials = "same-origin"),
            t
        );
    }
    function c(e) {
        if (e.ep) return;
        e.ep = !0;
        const t = i(e);
        fetch(e.href, t);
    }
})();
const q = "./simplifiedUS.svg",
    w = "./web.svg",
    b = document.querySelector("form"),
    v = document.querySelector("input#location"),
    f = document.querySelector(".errors"),
    l = document.querySelector(".unitSystem"),
    $ = document.querySelector("h1"),
    x = document.querySelector(".stat.temperature"),
    y = document.querySelector(".stat.condition"),
    C = document.querySelector(".stat.humidity"),
    L = document.querySelector(".stat.wind");
let a = 0,
    d = "auto:ip",
    o;
async function p(n) {
    try {
        const r = await fetch(
                `https://api.weatherapi.com/v1/current.json?key=048e2ea81af849ab80c100307230304&q=${n}`
            )
                .then((u) => u.json())
                .then((u) => {
                    if ("error" in u)
                        throw new Error(u.error.message, {
                            cause: u.error.code,
                        });
                    return u;
                }),
            {
                current: {
                    feelslike_c: i,
                    feelslike_f: c,
                    gust_kph: e,
                    gust_mph: t,
                    humidity: s,
                    condition: { text: h, icon: g },
                },
                location: { name: S },
            } = r;
        o = {
            location: S,
            temperature: { c: i, f: c },
            condition: { name: h, icon: g },
            humidity: s,
            wind: { kph: e, mph: t },
        };
    } catch (r) {
        f.textContent = r.message;
    }
}
function m() {
    var n, r, i, c;
    ($.textContent = o.location),
        a === 0
            ? (l.style.backgroundImage = `url(${w})`)
            : (l.style.backgroundImage = `url(${q})`),
        (x.querySelector("p").textContent =
            a === 0 ? `${o.temperature.c}°C` : `${o.temperature.f}°F`),
        (y.querySelector("img").src =
            (n = o.condition) == null ? void 0 : n.icon),
        (y.querySelector("p").textContent =
            (r = o.condition) == null ? void 0 : r.name),
        (C.querySelector("p").textContent = `${o.humidity}%`),
        (L.querySelector("p").textContent =
            a === 0
                ? `${(i = o.wind) == null ? void 0 : i.kph} kph`
                : `${(c = o.wind) == null ? void 0 : c.mph} mph`);
}
b.addEventListener("submit", (n) => {
    n.preventDefault(),
        (f.textContent = ""),
        (d = v.value),
        p(d).then(() => {
            m();
        });
});
l.addEventListener("click", () => {
    (a = a === 0 ? 1 : 0), m();
});
p(d).then(() => {
    m();
});
