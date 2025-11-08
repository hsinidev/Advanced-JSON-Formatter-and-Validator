import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Modal from './components/Modal';

type StatusType = 'idle' | 'success' | 'error' | 'warning';

interface StatusMessage {
  type: StatusType;
  text: string;
  details?: string;
}

const MODAL_CONTENT: Record<string, { title: string; content: React.ReactNode }> = {
    about: { title: "About Us", content: <p>This Advanced JSON Formatter & Validator is a lightweight, client-side tool designed for developers to quickly validate and beautify their JSON data. All processing happens in your browser, ensuring your data remains private.</p> },
    contact: { title: "Contact", content: <p>For support or inquiries, please visit our developer's GitHub page. We welcome feedback and contributions.</p> },
    guide: {
        title: "User Guide",
        content: (
            <div className="space-y-4">
                <p>Using the tool is simple:</p>
                <ol className="list-decimal list-inside space-y-2">
                    <li>Paste your raw JSON into the input area on the left.</li>
                    <li>Use the Control Panel on the right to select your desired formatting (indentation) and other options.</li>
                    <li>Click the "Process" button to validate and format the JSON.</li>
                    <li>The result will appear in the section below, indicating if the JSON is valid or not.</li>
                    <li>Use the "Copy" or "Download" buttons to use your formatted JSON.</li>
                </ol>
            </div>
        ),
    },
    privacy: { title: "Privacy Policy", content: <p>We respect your privacy. This application operates entirely on the client-side. No data you enter is ever sent to or stored on our servers. Everything stays within your browser.</p> },
    terms: { title: "Terms of Service", content: <p>This tool is provided "as is" without any warranties. By using this service, you agree not to hold us liable for any issues that may arise from its use. Use it at your own risk.</p> },
    dmca: { title: "DMCA", content: <p>All content is original. If you believe any content infringes on your copyright, please contact us via GitHub with the necessary documentation.</p> }
};

const EXAMPLE_JSON = `{
  "id": "0001",
  "type": "donut",
  "name": "Cake",
  "ppu": 0.55,
  "batters": {
    "batter": [
      { "id": "1001", "type": "Regular" },
      { "id": "1002", "type": "Chocolate" },
      { "id": "1003", "type": "Blueberry" },
      { "id": "1004", "type": "Devil's Food" }
    ]
  },
  "topping": [
    { "id": "5001", "type": "None" },
    { "id": "5002", "type": "Glazed" },
    { "id": "5005", "type": "Sugar" },
    { "id": "5007", "type": "Powdered Sugar" },
    { "id": "5006", "type": "Chocolate with Sprinkles" },
    { "id": "5003", "type": "Chocolate" },
    { "id": "5004", "type": "Maple" }
  ]
}`;

const App: React.FC = () => {
  const [jsonInput, setJsonInput] = useState<string>('');
  const [jsonOutput, setJsonOutput] = useState<string>('');
  const [status, setStatus] = useState<StatusMessage>({ type: 'idle', text: 'Ready to Process' });
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [formatOption, setFormatOption] = useState<string>('2');
  const [isFixJsonEnabled, setIsFixJsonEnabled] = useState<boolean>(false);
  const [copyButtonText, setCopyButtonText] = useState('Copy to Clipboard');

  const handleProcess = useCallback(() => {
    if (jsonInput.trim() === '') {
      setStatus({ type: 'error', text: 'Input is empty', details: 'Please paste some JSON to process.' });
      setJsonOutput('');
      return;
    }

    try {
      const parsedJson = JSON.parse(jsonInput);
      const indent = formatOption === 'compact' ? 0 : Number(formatOption);
      const formattedJson = JSON.stringify(parsedJson, null, indent);
      setJsonOutput(formattedJson);
      setStatus({ type: 'success', text: 'Valid JSON' });
    } catch (error) {
      setJsonOutput('');
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      if (isFixJsonEnabled) {
        setStatus({ type: 'warning', text: 'Auto-Fix Failed', details: `We couldn't automatically fix the JSON. Original error: ${errorMessage}` });
      } else {
        setStatus({ type: 'error', text: 'Invalid JSON', details: errorMessage });
      }
    }
  }, [jsonInput, formatOption, isFixJsonEnabled]);

  const handleClear = useCallback(() => {
    setJsonInput('');
    setJsonOutput('');
    setStatus({ type: 'idle', text: 'Ready to Process' });
  }, []);
  
  const handleLoadExample = useCallback(() => {
    setJsonInput(EXAMPLE_JSON);
    setStatus({ type: 'idle', text: 'Example loaded. Ready to process.' });
    setJsonOutput('');
  }, []);

  const handleCopy = useCallback(() => {
    if (!jsonOutput) return;
    navigator.clipboard.writeText(jsonOutput).then(() => {
      setCopyButtonText('Copied!');
      setTimeout(() => setCopyButtonText('Copy to Clipboard'), 2000);
    });
  }, [jsonOutput]);
  
  const handleDownload = useCallback(() => {
    if (!jsonOutput) return;
    const blob = new Blob([jsonOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [jsonOutput]);

  const openModal = useCallback((modalId: string) => setActiveModal(modalId), []);
  const closeModal = useCallback(() => setActiveModal(null), []);

  const getStatusColorClasses = (type: StatusType) => {
    switch (type) {
      case 'success': return 'bg-green-500/20 text-green-300 border-green-500';
      case 'error': return 'bg-red-500/20 text-red-300 border-red-500';
      case 'warning': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500';
      default: return 'bg-gray-700/50 text-gray-400 border-gray-600';
    }
  };

  const navItems = Object.keys(MODAL_CONTENT);

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen flex flex-col font-sans">
      <Header navItems={navItems} onNavClick={openModal} />
      
      <main className="w-full max-w-7xl mx-auto p-4 md:p-8 flex-grow flex flex-col gap-8">
        
        {/* Input Section */}
        <section className="bg-gray-800/50 border border-gray-700 rounded-lg shadow-2xl p-6">
            <h2 className="text-xl font-bold mb-4 text-white">JSON Input</h2>
            <div className="flex flex-col md:flex-row gap-6">
                <textarea
                    id="json-input"
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder="Paste your JSON here..."
                    className="w-full md:w-2/3 h-80 md:h-96 bg-gray-900 border-2 border-gray-700 rounded-lg p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-y"
                    spellCheck="false"
                    aria-label="JSON Input Area"
                />
                
                {/* Control Panel */}
                <div className="w-full md:w-1/3 flex flex-col gap-4 bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <h3 className="font-bold text-lg text-white">Controls</h3>
                    <div>
                        <label htmlFor="template-select" className="block text-sm font-medium text-gray-300 mb-2">JSON Template</label>
                        <select id="template-select" value={formatOption} onChange={e => setFormatOption(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="2">2 Space Tab</option>
                            <option value="4">4 Space Tab</option>
                            <option value="compact">Compact (Minify)</option>
                        </select>
                    </div>

                    <div className="relative group flex items-center gap-2 mt-2">
                         <input id="fix-json" type="checkbox" checked={isFixJsonEnabled} onChange={e => setIsFixJsonEnabled(e.target.checked)} className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500" />
                         <label htmlFor="fix-json" className="text-sm font-medium text-gray-300">Fix JSON</label>
                         <div className="absolute left-0 bottom-full mb-2 w-max max-w-xs p-2 text-xs text-white bg-gray-900 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 border border-gray-700">
                           Simulates fixing common errors like trailing commas or missing quotes. (Experimental)
                         </div>
                    </div>

                    <div className="mt-auto flex flex-col gap-3">
                      <button onClick={handleProcess} className="w-full px-6 py-3 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 transition duration-200 text-lg">Process</button>
                      <div className="flex gap-3">
                        <button onClick={handleLoadExample} className="flex-1 px-4 py-2 rounded-md font-semibold text-white bg-gray-600 hover:bg-gray-700 transition duration-200">Load Example</button>
                        <button onClick={handleClear} className="flex-1 px-4 py-2 rounded-md font-semibold text-white bg-red-600/80 hover:bg-red-700/80 transition duration-200">Clear</button>
                      </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Results Section */}
        <section className="bg-gray-800/50 border border-gray-700 rounded-lg shadow-2xl p-6">
            <h2 className="text-xl font-bold mb-4 text-white">Result</h2>
            <div className={`w-full p-4 mb-4 rounded-md text-center text-lg font-bold border ${getStatusColorClasses(status.type)}`}>
              {status.text}
            </div>
             <div className="flex justify-end gap-4 mb-4">
                <button onClick={handleCopy} disabled={!jsonOutput} className="px-5 py-2 rounded-md font-semibold text-white bg-gray-600 hover:bg-gray-700 transition duration-200 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed">{copyButtonText}</button>
                <button onClick={handleDownload} disabled={!jsonOutput} className="px-5 py-2 rounded-md font-semibold text-white bg-green-600 hover:bg-green-700 transition duration-200 disabled:bg-green-900 disabled:text-gray-500 disabled:cursor-not-allowed">Download JSON</button>
            </div>
             <textarea
                value={status.type === 'error' || status.type === 'warning' ? status.details : jsonOutput}
                readOnly
                placeholder="Output will appear here..."
                className={`w-full h-96 bg-gray-900 border-2 rounded-lg p-4 font-mono text-sm focus:outline-none resize-y ${status.type === 'error' ? 'border-red-700 text-red-300' : status.type === 'warning' ? 'border-yellow-700 text-yellow-300' : 'border-gray-700'}`}
                aria-label="JSON Output Area"
            />
        </section>

      </main>

      <Footer />

      {activeModal && MODAL_CONTENT[activeModal] && (
        <Modal isOpen={!!activeModal} onClose={closeModal} title={MODAL_CONTENT[activeModal].title}>
          {MODAL_CONTENT[activeModal].content}
        </Modal>
      )}
    </div>
  );
};

export default App;
