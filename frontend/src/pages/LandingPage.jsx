import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('flotte');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#030014] text-white overflow-x-hidden font-sans selection:bg-purple-500/30 selection:text-purple-200">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] mix-blend-screen animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      {/* Floating Navbar */}
      <nav className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-[90%] max-w-5xl rounded-full ${scrolled ? 'bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg shadow-purple-500/10 py-3' : 'bg-transparent py-5'}`}>
        <div className="px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <span className="font-bold text-white text-lg">N</span>
            </div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">NAVIX</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            {['Fonctionnalités', 'Solutions', 'Tarifs', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-white transition-colors relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all group-hover:w-full"></span>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Connexion</Link>
            <Link to="/register" className="group relative px-6 py-2.5 rounded-full overflow-hidden bg-white text-black font-semibold text-sm shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.5)] transition-all">
              <span className="relative z-10 flex items-center gap-2">
                Commencer
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-40 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-medium text-gray-300 tracking-wide uppercase">Nouvelle Version Disponible</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-tight animate-fade-in-up">
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-500">La gestion de flotte</span>
            <span className="relative inline-block">
              <span className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-2xl opacity-30"></span>
              <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Réinventée.</span>
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-12 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Optimisez vos opérations, suivez vos véhicules en temps réel et réduisez vos coûts de maintenance. <br className="hidden md:block"/> La solution tout-en-un pour les transporteurs modernes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold hover:scale-105 transition-transform shadow-[0_0_40px_-10px_rgba(124,58,237,0.5)] border border-white/10 text-center">
              Essai Gratuit
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              Voir Démo
            </button>
          </div>

          {/* Hero Dashboard Preview */}
          <div className="relative mx-auto max-w-5xl rounded-2xl p-1 bg-gradient-to-b from-white/10 to-transparent animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
             <div className="bg-[#0B0B15] rounded-xl overflow-hidden shadow-2xl skew-x-0 group">
                <div className="h-8 bg-[#1A1A24] flex items-center px-4 gap-2 border-b border-white/5">
                   <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                   <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                   <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
                <div className="relative aspect-[16/9] bg-[#0E0E1B]">
                   {/* Fake Dashboard UI */}
                   <div className="absolute inset-0 p-8 grid grid-cols-12 gap-6">
                      {/* Sidebar */}
                      <div className="col-span-2 hidden md:block space-y-4">
                         {[1,2,3,4,5].map(i => (
                            <div key={i} className="h-4 w-full rounded-lg bg-white/5 animate-pulse" style={{ animationDelay: `${i * 100}ms` }}></div>
                         ))}
                      </div>
                      {/* Main Area */}
                      <div className="col-span-12 md:col-span-10 grid grid-rows-3 gap-6">
                         <div className="grid grid-cols-3 gap-6">
                            {/* Card 1 */}
                            <div className="h-32 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 p-4 relative overflow-hidden group hover:border-purple-500/30 transition-colors">
                               <div className="absolute top-0 right-0 p-4 opacity-20">
                                  <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
                               </div>
                               <div className="text-gray-400 text-sm mb-1">Camions Actifs</div>
                               <div className="text-2xl font-bold text-white">42 / 50</div>
                               <div className="text-xs text-green-400 mt-2">+4 cette semaine</div>
                            </div>
                            {/* Card 2 */}
                            <div className="h-32 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 p-4 relative overflow-hidden group hover:border-purple-500/30 transition-colors">
                               <div className="absolute top-0 right-0 p-4 opacity-20">
                                  <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                               </div>
                               <div className="text-gray-400 text-sm mb-1">Carburant</div>
                               <div className="text-2xl font-bold text-white">-15%</div>
                               <div className="text-xs text-green-400 mt-2">vs mois dernier</div>
                            </div>
                            {/* Card 3 */}
                            <div className="h-32 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 p-4 relative overflow-hidden group hover:border-purple-500/30 transition-colors">
                               <div className="absolute top-0 right-0 p-4 opacity-20">
                               <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                               </div>
                               <div className="text-gray-400 text-sm mb-1">Trajets en cours</div>
                               <div className="text-2xl font-bold text-white">18</div>
                               <div className="text-xs text-blue-400 mt-2">Tout à l'heure</div>
                            </div>
                         </div>
                         <div className="row-span-2 bg-[#13132B] rounded-xl border border-white/5 p-6 relative">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#13132B] to-transparent z-10"></div>
                            <div className="flex items-center gap-4 mb-6">
                               <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">Map</div>
                               <div className="h-4 w-32 bg-white/10 rounded"></div>
                            </div>
                            <div className="space-y-3">
                               <div className="h-4 w-full bg-white/5 rounded"></div>
                               <div className="h-4 w-5/6 bg-white/5 rounded"></div>
                               <div className="h-4 w-4/6 bg-white/5 rounded"></div>
                            </div>
                            

                            {/* Floating Messages */}

                         </div>
                      </div>
                   </div>
                   {/* Gradient Overlay */}
                   <div className="absolute inset-0 bg-gradient-to-t from-[#030014] to-transparent pointer-events-none"></div>
                </div>
             </div>
          </div>
        </div>
      </section>

            {/* Features List Section (Designed for Efficiency) */}
      <section className="py-32 relative z-10 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-[-20%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
           <div className="mb-24">
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">Conçu pour<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">l'efficacité</span></h2>
              <p className="text-gray-400 text-lg max-w-xl leading-relaxed">Une suite complète d'outils pour gérer votre flotte de A à Z, sans friction, avec une interface moderne et intuitive.</p>
           </div>

           <div className="space-y-20">
              {/* Row 1: Gestion de Flotte */}
              <div className="border-t border-white/10 pt-10">
                 <h3 className="text-purple-400 font-semibold mb-10 uppercase tracking-widest text-xs">Gestion de Flotte</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-16">
                     {/* Item 1 */}
                     <div className="group">
                        <div className="mb-6 text-gray-300 group-hover:text-purple-400 transition-colors duration-300">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                        </div>
                        <h4 className="text-xl font-bold text-white mb-3">Suivi Temps Réel</h4>
                        <p className="text-gray-500 leading-relaxed text-sm">Localisez vos véhicules instantanément et suivez leurs déplacements sur une carte interactive détaillée.</p>
                     </div>
                     {/* Item 2 */}
                     <div className="group">
                        <div className="mb-6 text-gray-300 group-hover:text-purple-400 transition-colors duration-300">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        </div>
                        <h4 className="text-xl font-bold text-white mb-3">Optimisation Trajets</h4>
                        <p className="text-gray-500 leading-relaxed text-sm">Réduisez les kilomètres parcourus et économisez du carburant grâce à nos algorithmes d'optimisation IA.</p>
                     </div>
                     {/* Item 3 */}
                     <div className="group">
                        <div className="mb-6 text-gray-300 group-hover:text-purple-400 transition-colors duration-300">
                             <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                        </div>
                        <h4 className="text-xl font-bold text-white mb-3">Suivi Maintenance</h4>
                        <p className="text-gray-500 leading-relaxed text-sm">Gérez l'entretien de votre parc et recevez des alertes avant qu'une panne ne survienne.</p>
                     </div>
                 </div>
              </div>

              {/* Row 2: Administration */}
              <div className="border-t border-white/10 pt-10">
                 <h3 className="text-purple-400 font-semibold mb-10 uppercase tracking-widest text-xs">Administration & Sécurité</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-16">
                     {/* Item 1 */}
                     <div className="group">
                        <div className="mb-6 text-gray-300 group-hover:text-purple-400 transition-colors duration-300">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <h4 className="text-xl font-bold text-white mb-3">Rapports Détaillés</h4>
                        <p className="text-gray-500 leading-relaxed text-sm">Analysez la performance de votre flotte avec des rapports personnalisables et exportables en un clic.</p>
                     </div>
                     {/* Item 2 */}
                     <div className="group">
                        <div className="mb-6 text-gray-300 group-hover:text-purple-400 transition-colors duration-300">
                           <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        </div>
                        <h4 className="text-xl font-bold text-white mb-3">Gestion Conducteurs</h4>
                        <p className="text-gray-500 leading-relaxed text-sm">Gérez les profils de vos chauffeurs, leurs permis, et assurez la conformité légale et la sécurité.</p>
                     </div>
                     {/* Item 3 */}
                     <div className="group">
                        <div className="mb-6 text-gray-300 group-hover:text-purple-400 transition-colors duration-300">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </div>
                        <h4 className="text-xl font-bold text-white mb-3">Support 24/7</h4>
                        <p className="text-gray-500 leading-relaxed text-sm">Une équipe dédiée pour vous accompagner et résoudre vos problèmes techniques à tout moment.</p>
                     </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

{/* Tabs / Interactive Section */}
      <section className="py-24 bg-[#0B0B15]/50 border-y border-white/5">
         <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-12 items-center">
               <div className="w-full md:w-1/2">
                  <h2 className="text-4xl font-bold mb-8">Un contrôle total,<br/>sur tous les aspects</h2>
                  <div className="space-y-4">
                     {[
                        { id: 'flotte', title: 'Gestion de Flotte', desc: 'Gérez vos camions, remorques et pneus centralisés sur une seule plateforme.' },
                        { id: 'couts', title: 'Maîtrise des Coûts', desc: 'Analysez la consommation de carburant et les dépenses de maintenance.' },
                        { id: 'securite', title: 'Sécurité & Chauffeurs', desc: 'Assurez la conformité et la sécurité de vos équipes sur la route.' }
                     ].map((tab) => (
                        <div 
                           key={tab.id}
                           onClick={() => setActiveTab(tab.id)}
                           className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border ${activeTab === tab.id ? 'bg-[#1A1A2E] border-purple-500/50 shadow-lg shadow-purple-900/10' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                        >
                           <h3 className={`text-xl font-bold mb-2 ${activeTab === tab.id ? 'text-purple-400' : 'text-white'}`}>{tab.title}</h3>
                           <p className="text-gray-400">{tab.desc}</p>
                        </div>
                     ))}
                  </div>
               </div>
               
                              <div className="w-full md:w-1/2">
                  <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                      <div className="absolute inset-0 bg-indigo-500/10 mix-blend-overlay z-10"></div>
                      <img 
                        src="https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?q=80&w=1706&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                        alt="Dashboard Navix" 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B15] via-transparent to-transparent opacity-60"></div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-indigo-900/10 z-0"></div>
         <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter">Prêt à passer à la <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">vitesse supérieure ?</span></h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">Rejoignez les centaines d'entreprises qui font confiance à Navix pour leur logistique.</p>
            
            <form className="max-w-md mx-auto relative mb-8">
               <input 
                  type="email" 
                  placeholder="Votre adresse email professionnelle" 
                  className="w-full h-16 pl-6 pr-40 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
               />
               <button className="absolute right-2 top-2 h-12 px-8 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-colors">
                  Commencer
               </button>
            </form>
            <p className="text-sm text-gray-500">Essai gratuit 14 jours • Sans engagement • Support dédié</p>
         </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#05050B] pt-20 pb-10 font-sans">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-10 mb-20">
             <div className="col-span-2 lg:col-span-2">
                <a href="#" className="flex items-center gap-2 mb-6">
                   <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                     <span className="font-bold text-white">N</span>
                   </div>
                   <span className="font-bold text-xl tracking-tight">NAVIX</span>
                </a>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xs">
                   La plateforme de référence pour la gestion de flotte intelligente.
                </p>
                <div className="flex gap-4">
                   <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
                      {/* Social icons remain same */}
                      <span className="sr-only">Twitter</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/></svg>
                   </a>
                   <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
                      <span className="sr-only">GitHub</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/></svg>
                   </a>
                </div>
             </div>
             
             <div>
                <h4 className="font-bold text-white mb-6">Produit</h4>
                <ul className="space-y-4 text-sm text-gray-400">
                   <li><a href="#" className="hover:text-purple-400 transition-colors">Fonctionnalités</a></li>
                   <li><a href="#" className="hover:text-purple-400 transition-colors">Intégrations</a></li>
                   <li><a href="#" className="hover:text-purple-400 transition-colors">Tarifs</a></li>
                   <li><a href="#" className="hover:text-purple-400 transition-colors">Mises à jour</a></li>
                </ul>
             </div>
             <div>
                <h4 className="font-bold text-white mb-6">Entreprise</h4>
                <ul className="space-y-4 text-sm text-gray-400">
                   <li><a href="#" className="hover:text-purple-400 transition-colors">À propos</a></li>
                   <li><a href="#" className="hover:text-purple-400 transition-colors">Carrières</a></li>
                   <li><a href="#" className="hover:text-purple-400 transition-colors">Blog</a></li>
                   <li><a href="#" className="hover:text-purple-400 transition-colors">Contact</a></li>
                </ul>
             </div>
             <div>
                <h4 className="font-bold text-white mb-6">Ressources</h4>
                <ul className="space-y-4 text-sm text-gray-400">
                   <li><a href="#" className="hover:text-purple-400 transition-colors">Communauté</a></li>
                   <li><a href="#" className="hover:text-purple-400 transition-colors">Centre d'aide</a></li>
                   <li><a href="#" className="hover:text-purple-400 transition-colors">Documentation</a></li>
                </ul>
             </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center py-8 border-t border-white/5 text-xs text-gray-600">
             <p>© 2026 Navix Inc. Tous droits réservés.</p>
             <div className="flex gap-8 mt-4 md:mt-0">
                <span>Politique de confidentialité</span>
                <span>Conditions d'utilisation</span>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;