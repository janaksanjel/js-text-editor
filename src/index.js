import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaListUl,
  FaListOl,
  FaLink,
  FaImage,
  FaUndo,
  FaRedo,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
  FaCode,
  FaHighlighter,
  FaDownload,
  FaExpand,
  FaCompress,
  FaSuperscript,
  FaSubscript,
  FaIndent,
  FaOutdent,
  FaTable,
  FaVideo,
  FaPrint,
  FaFont,
  FaSave,
  FaFile,
  FaSpellCheck,
  FaChevronDown,
  FaRulerHorizontal,
  FaCut,
  FaCopy,
  FaPaste,
  FaTextHeight,
  FaPalette,
  FaEye,
  FaEyeSlash,
  FaHeading,
  FaTrash,
  FaHistory,
  FaFileExport,
} from "react-icons/fa";
import {
  Modal,
  Button,
  Form,
  InputGroup,
  FormControl,
  Tabs,
  Tab,
  Dropdown,
} from "react-bootstrap";

const JsTextEditor = () => {
  const [editorContent, setEditorContent] = useState("<p></p>");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [showTableModal, setShowTableModal] = useState(false);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("https://");
  const [linkText, setLinkText] = useState("");
  const [videoEmbed, setVideoEmbed] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [fontFamily, setFontFamily] = useState("Inter");
  const [fontSize, setFontSize] = useState("14");
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [docName, setDocName] = useState("Untitled Document");
  const [showDocNameInput, setShowDocNameInput] = useState(false);
  const [tempDocName, setTempDocName] = useState("");
  const [selection, setSelection] = useState(null);
  const [tableStyle, setTableStyle] = useState("default");
  const [cellPadding, setCellPadding] = useState(5);
  const [cellSpacing, setCellSpacing] = useState(0);
  const [tableWidth, setTableWidth] = useState(100);
  const [borderWidth, setBorderWidth] = useState(1);
  const [headerRow, setHeaderRow] = useState(true);
  const [textColor, setTextColor] = useState("#333333");
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [history, setHistory] = useState([]);
  const [historyPosition, setHistoryPosition] = useState(-1);
  const [savedDocs, setSavedDocs] = useState([]);
  const [showSavedDocsModal, setShowSavedDocsModal] = useState(false);
  const [viewMode, setViewMode] = useState("edit");

  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const loadSavedDocsList = () => {
      const docs = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key !== "yjs-clients") docs.push(key);
      }
      setSavedDocs(docs);
    };
    loadSavedDocsList();
  }, []);

  // Set initial content only on mount
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = editorContent;
    }
  }, []);

  const modernStyles = {
    container: {
      width: "90vw",
      maxWidth: "1200px",
      margin: "20px auto",
      backgroundColor: "#FFFFFF",
      borderRadius: "8px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      fontFamily: "'Inter', 'Roboto', 'Helvetica', sans-serif",
      position: "relative",
    },
    fullscreen: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
      margin: 0,
      width: "100%",
      height: "100%",
      borderRadius: 0,
      overflow: "auto",
    },
    toolbar: {
      backgroundColor: "#F7F7F7",
      borderBottom: "1px solid #E5E7EB",
      padding: "8px 12px",
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      alignItems: "center",
    },
    toolbarGroup: {
      display: "flex",
      gap: "4px",
      paddingRight: "12px",
      borderRight: "1px solid #E5E7EB",
    },
    button: {
      backgroundColor: "#FFFFFF",
      border: "1px solid #D1D5DB",
      color: "#333333",
      padding: "6px 8px",
      borderRadius: "4px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "13px",
      transition: "background-color 0.2s",
    },
    buttonHover: {
      backgroundColor: "#E0E0E0",
    },
    dropdown: {
      backgroundColor: "#FFFFFF",
      border: "1px solid #D1D5DB",
      borderRadius: "4px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      padding: "8px",
    },
    editor: {
      minHeight: "50vh",
      maxHeight: "50vh",
      padding: "16px",
      border: "1px solid #E5E7EB",
      borderRadius: "4px",
      backgroundColor: "#FFFFFF",
      outline: "none",
      overflowY: "auto",
      margin: "12px",
      direction: "ltr", // Ensure left-to-right text direction
    },
    preview: {
      minHeight: "50vh",
      padding: "16px",
      border: "1px solid #E5E7EB",
      borderRadius: "4px",
      backgroundColor: "#FFFFFF",
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      margin: "12px",
      overflow: "auto",
    },
    statusBar: {
      padding: "8px 12px",
      borderTop: "1px solid #E5E7EB",
      fontSize: "11px",
      color: "#6B7280",
      backgroundColor: "#F1F3F4",
      borderRadius: "0 0 8px 8px",
    },
    notification: {
      position: "fixed",
      bottom: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      backgroundColor: "#10B981",
      color: "#FFFFFF",
      padding: "12px 20px",
      borderRadius: "6px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      zIndex: 9999,
      animation: "fadeIn 0.3s ease-in-out",
    },
  };

  const tableStyles = {
    default: {
      tableStyle: "border-collapse: collapse; width: 100%;",
      cellStyle: "padding: 8px; border: 1px solid #E5E7EB;",
      headerStyle:
        "background-color: #F7F7F7; font-weight: 600; padding: 8px; border: 1px solid #E5E7EB;",
    },
    striped: {
      tableStyle: "border-collapse: collapse; width: 100%;",
      cellStyle: "padding: 8px; border: 1px solid #E5E7EB;",
      headerStyle:
        "background-color: #10B981; color: white; font-weight: 600; padding: 8px; border: 1px solid #10B981;",
      rowStyle: "background-color: #F9FAFB;",
    },
    borderless: {
      tableStyle: "border-collapse: collapse; width: 100%;",
      cellStyle: "padding: 8px; border-bottom: 1px solid #E5E7EB;",
      headerStyle:
        "border-bottom: 2px solid #E5E7EB; font-weight: 600; padding: 8px;",
    },
    minimal: {
      tableStyle: "border-collapse: collapse; width: 100%;",
      cellStyle: "padding: 8px;",
      headerStyle:
        "border-bottom: 2px solid #333333; font-weight: 600; padding: 8px;",
    },
  };

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      setSelection(sel.getRangeAt(0));
      return sel.getRangeAt(0);
    }
    return null;
  };

  const restoreSelection = () => {
    if (!selection) return false;
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(selection);
    return true;
  };

  const addToHistory = (content) => {
    const newHistory = history.slice(0, historyPosition + 1);
    newHistory.push(content);
    if (newHistory.length > 50) newHistory.shift();
    setHistory(newHistory);
    setHistoryPosition(newHistory.length - 1);
  };

  const navigateHistory = (direction) => {
    let newPosition = historyPosition + direction;
    if (newPosition >= 0 && newPosition < history.length) {
      setHistoryPosition(newPosition);
      setEditorContent(history[newPosition]);
      if (editorRef.current) {
        editorRef.current.innerHTML = history[newPosition];
      }
      return true;
    }
    return false;
  };

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      const currentContent = editorRef.current.innerHTML;
      setEditorContent(currentContent);
      addToHistory(currentContent);
    }
    editorRef.current.focus();
  };

  const handleFontChange = (font) => {
    setFontFamily(font);
    formatText("fontName", font);
    setShowFontDropdown(false);
  };

  const handleFontSizeChange = (size) => {
    setFontSize(size);
    formatText("fontSize", fontSizeMap[size]);
    setShowFontDropdown(false);
  };

  const fontSizeMap = { 8: 1, 10: 2, 12: 3, 14: 4, 18: 5, 24: 6, 36: 7 };

  const showNotify = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleExport = () => {
    const blob = new Blob([editorRef.current.innerHTML], { type: "text/html" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${docName}.html`;
    link.click();
    showNotify("Document exported successfully!");
  };

  const handlePrint = () => {
    const printContent = editorRef.current.innerHTML;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${docName}</title>
          <style>
            body { font-family: ${fontFamily}; font-size: ${fontSize}px; margin: 20px; }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleSaveAsPDF = () => {
    const printContent = editorRef.current.innerHTML;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${docName}</title>
          <style>
            body { font-family: ${fontFamily}; font-size: ${fontSize}px; margin: 20px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          ${printContent}
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleImage = () => fileInputRef.current.click();

  const handleCopy = () => {
    document.execCommand("copy");
    showNotify("Content copied to clipboard!");
  };

  const handleInsertTable = () => {
    const selectedStyle = tableStyles[tableStyle];
    let tableHtml = `<table style="${selectedStyle.tableStyle} width: ${tableWidth}%; border: ${borderWidth}px solid #E5E7EB; padding: ${cellPadding}px; spacing: ${cellSpacing}px;">`;
    if (headerRow) {
      tableHtml += "<thead><tr>";
      for (let j = 0; j < tableCols; j++) {
        tableHtml += `<th style="${selectedStyle.headerStyle}">Header ${j + 1
          }</th>`;
      }
      tableHtml += "</tr></thead>";
    }
    tableHtml += "<tbody>";
    for (let i = 0; i < tableRows; i++) {
      const rowStyle =
        tableStyle === "striped" && i % 2 === 1
          ? ` style="${selectedStyle.rowStyle}"`
          : "";
      tableHtml += `<tr${rowStyle}>`;
      for (let j = 0; j < tableCols; j++) {
        tableHtml += `<td style="${selectedStyle.cellStyle}">Cell ${i + 1}-${j + 1
          }</td>`;
      }
      tableHtml += "</tr>";
    }
    tableHtml += "</tbody></table>";

    if (editorRef.current) {
      restoreSelection();
      const range = window.getSelection().getRangeAt(0);
      range.deleteContents();
      const div = document.createElement("div");
      div.innerHTML = tableHtml;
      range.insertNode(div.firstChild);
      const currentContent = editorRef.current.innerHTML;
      setEditorContent(currentContent);
      addToHistory(currentContent);
    }
    setShowTableModal(false);
  };

  const handleInsertLink = () => {
    restoreSelection();
    if (linkText && linkUrl) {
      const linkHtml = `<a href="${linkUrl}" target="_blank">${linkText}</a>`;
      formatText("insertHTML", linkHtml);
    } else if (linkUrl) {
      formatText("createLink", linkUrl);
    }
    setShowLinkModal(false);
    setLinkUrl("https://");
    setLinkText("");
  };

  const handleInsertVideo = () => {
    restoreSelection();
    formatText("insertHTML", videoEmbed);
    setShowVideoModal(false);
    setVideoEmbed("");
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    if (!isFullScreen) {
      containerRef.current.requestFullscreen?.() ||
        containerRef.current.mozRequestFullScreen?.() ||
        containerRef.current.webkitRequestFullscreen?.() ||
        containerRef.current.msRequestFullscreen?.();
    } else {
      document.exitFullscreen?.() ||
        document.mozCancelFullScreen?.() ||
        document.webkitExitFullscreen?.() ||
        document.msExitFullscreen?.();
    }
  };

  const saveDocument = () => {
    const content = editorRef.current.innerHTML;
    localStorage.setItem(docName, content);
    if (!savedDocs.includes(docName)) setSavedDocs([...savedDocs, docName]);
    showNotify(`Document "${docName}" saved successfully!`);
  };

  const saveAsDoc = () => {
    const blob = new Blob(
      [
        `
      <html>
        <head><style>body { font-family: ${fontFamily}; font-size: ${fontSize}px; }</style></head>
        <body>${editorRef.current.innerHTML}</body>
      </html>
    `,
      ],
      { type: "application/msword" }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${docName}.doc`;
    link.click();
    showNotify("Document saved as .doc file!");
  };

  const loadDocument = (name) => {
    const savedContent = localStorage.getItem(name);
    if (savedContent) {
      setEditorContent(savedContent);
      if (editorRef.current) {
        editorRef.current.innerHTML = savedContent;
      }
      setDocName(name);
      addToHistory(savedContent);
      setShowSavedDocsModal(false);
      showNotify(`Document "${name}" loaded successfully!`);
    }
  };

  const deleteDocument = (name) => {
    localStorage.removeItem(name);
    setSavedDocs(savedDocs.filter((doc) => doc !== name));
    if (docName === name) {
      setDocName("Untitled Document");
      setEditorContent("<p></p>");
      if (editorRef.current) {
        editorRef.current.innerHTML = "<p></p>";
      }
    }
    showNotify(`Document "${name}" deleted successfully!`);
  };

  const handleViewSource = () => setShowSourceModal(true);

  const handleUpdateDocName = () => {
    if (tempDocName.trim()) {
      setDocName(tempDocName.trim());
      setShowDocNameInput(false);
    }
  };

  const handleOpenLinkModal = () => {
    saveSelection();
    const selectedText = window.getSelection().toString();
    if (selectedText) setLinkText(selectedText);
    setShowLinkModal(true);
  };

  const handleOpenVideoModal = () => {
    saveSelection();
    setShowVideoModal(true);
  };

  const handleApplyTextColor = () => formatText("foreColor", textColor);
  const handleApplyBackgroundColor = () =>
    formatText("hiliteColor", backgroundColor);
  const handleUndo = () => navigateHistory(-1) || formatText("undo");
  const handleRedo = () => navigateHistory(1) || formatText("redo");
  const applyHeading = (level) => formatText("formatBlock", `<h${level}>`);

  const handleInput = () => {
    if (editorRef.current) {
      const currentContent = editorRef.current.innerHTML;
      setEditorContent(currentContent);
      debounce(() => {
        addToHistory(currentContent);
        const text = editorRef.current.innerText;
        setWordCount(text.split(/\s+/).filter(Boolean).length);
        setCharCount(text.length);
      }, 300)();
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      if (
        !document.fullscreenElement &&
        !document.webkitIsFullScreen &&
        !document.mozFullScreen &&
        !document.msFullscreenElement
      ) {
        setIsFullScreen(false);
      }
    };
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullScreenChange);
    document.addEventListener("mozfullscreenchange", handleFullScreenChange);
    document.addEventListener("MSFullscreenChange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullScreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullScreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullScreenChange
      );
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        ...modernStyles.container,
        ...(isFullScreen ? modernStyles.fullscreen : {}),
      }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        button:hover:not(:disabled) { background-color: ${modernStyles.buttonHover.backgroundColor}; }
      `}</style>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 12px 0",
          marginBottom: "20px",
        }}
      >
        {showDocNameInput ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="text"
              value={tempDocName}
              onChange={(e) => setTempDocName(e.target.value)}
              style={{
                padding: "6px",
                borderRadius: "4px",
                border: "1px solid #D1D5DB",
                fontSize: "14px",
              }}
            />
            <button style={modernStyles.button} onClick={handleUpdateDocName}>
              Save
            </button>
            <button
              style={modernStyles.button}
              onClick={() => setShowDocNameInput(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <h1
            style={{
              margin: 0,
              fontSize: "20px",
              color: "#333333",
              cursor: "pointer",
              fontWeight: 600,
            }}
            onClick={() => {
              setTempDocName(docName);
              setShowDocNameInput(true);
            }}
          >
            {docName}
          </h1>
        )}
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            style={{
              ...modernStyles.button,
              backgroundColor: viewMode === "edit" ? "#E5E7EB" : "#FFFFFF",
            }}
            onClick={() => setViewMode("edit")}
          >
            <FaEye /> Edit
          </button>
          <button
            style={{
              ...modernStyles.button,
              backgroundColor: viewMode === "preview" ? "#E5E7EB" : "#FFFFFF",
            }}
            onClick={() => setViewMode("preview")}
          >
            <FaEyeSlash /> Preview
          </button>
        </div>
      </div>

      {viewMode === "edit" && (
        <>
          <div style={modernStyles.toolbar}>
            <div style={modernStyles.toolbarGroup}>
              <button
                style={modernStyles.button}
                onClick={() => {
                  setDocName("Untitled Document");
                  setEditorContent("<p></p>");
                  if (editorRef.current)
                    editorRef.current.innerHTML = "<p></p>";
                  addToHistory("<p></p>");
                }}
              >
                <FaFile /> New
              </button>
              <button style={modernStyles.button} onClick={saveDocument}>
                <FaSave /> Save
              </button>
              <button
                style={modernStyles.button}
                onClick={() => setShowSavedDocsModal(true)}
              >
                <FaHistory /> Open
              </button>
              <button style={modernStyles.button} onClick={saveAsDoc}>
                <FaDownload /> Save as DOC
              </button>
              <button style={modernStyles.button} onClick={handlePrint}>
                <FaPrint /> Print
              </button>
              <button style={modernStyles.button} onClick={handleSaveAsPDF}>
                <FaFileExport /> Save as PDF
              </button>
            </div>
            <div style={modernStyles.toolbarGroup}>
              <button
                style={modernStyles.button}
                onClick={() => formatText("cut")}
              >
                <FaCut /> Cut
              </button>
              <button style={modernStyles.button} onClick={handleCopy}>
                <FaCopy /> Copy
              </button>
              <button
                style={modernStyles.button}
                onClick={() => formatText("paste")}
              >
                <FaPaste /> Paste
              </button>
              <button style={modernStyles.button} onClick={handleUndo}>
                <FaUndo /> Undo
              </button>
              <button style={modernStyles.button} onClick={handleRedo}>
                <FaRedo /> Redo
              </button>
              <div style={modernStyles.toolbarGroup}>
                <Dropdown>
                  <Dropdown.Toggle style={modernStyles.button}>
                    <FaHeading /> Headings
                  </Dropdown.Toggle>
                  <Dropdown.Menu style={modernStyles.dropdown}>
                    <Dropdown.Item onClick={() => applyHeading(1)}>
                      Heading 1
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => applyHeading(2)}>
                      Heading 2
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => applyHeading(3)}>
                      Heading 3
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => applyHeading(4)}>
                      Heading 4
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => formatText("formatBlock", "<p>")}
                    >
                      Paragraph
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  style={{ width: "24px", height: "24px" }}
                />
                <button
                  style={modernStyles.button}
                  onClick={handleApplyTextColor}
                >
                  <FaPalette />
                </button>
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  style={{ width: "24px", height: "24px" }}
                />
                <button
                  style={modernStyles.button}
                  onClick={handleApplyBackgroundColor}
                >
                  <FaHighlighter />
                </button>
              </div>
            </div>
            <div style={modernStyles.toolbarGroup}>
              <div style={{ position: "relative" }}>
                <button
                  style={modernStyles.button}
                  onClick={() => setShowFontDropdown(!showFontDropdown)}
                >
                  <FaFont /> {fontFamily} <FaChevronDown />
                </button>
                {showFontDropdown && (
                  <div
                    style={{
                      ...modernStyles.dropdown,
                      position: "absolute",
                      zIndex: 1000,
                    }}
                  >
                    <select
                      style={{
                        width: "150px",
                        padding: "4px",
                        marginBottom: "8px",
                      }}
                      value={fontFamily}
                      onChange={(e) => handleFontChange(e.target.value)}
                    >
                      <option value="Inter">Inter</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Arial">Arial</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Verdana">Verdana</option>
                    </select>
                    <select
                      style={{ width: "60px", padding: "4px" }}
                      value={fontSize}
                      onChange={(e) => handleFontSizeChange(e.target.value)}
                    >
                      <option value="8">8</option>
                      <option value="10">10</option>
                      <option value="12">12</option>
                      <option value="14">14</option>
                      <option value="18">18</option>
                      <option value="24">24</option>
                      <option value="36">36</option>
                    </select>
                  </div>
                )}
              </div>
              <button
                style={modernStyles.button}
                onClick={() => formatText("bold")}
              >
                <FaBold />
              </button>
              <button
                style={modernStyles.button}
                onClick={() => formatText("italic")}
              >
                <FaItalic />
              </button>
              <button
                style={modernStyles.button}
                onClick={() => formatText("underline")}
              >
                <FaUnderline />
              </button>
              <button
                style={modernStyles.button}
                onClick={() => formatText("strikeThrough")}
              >
                <FaStrikethrough />
              </button>
              <button
                style={modernStyles.button}
                onClick={() => formatText("superscript")}
              >
                <FaSuperscript />
              </button>
              <button
                style={modernStyles.button}
                onClick={() => formatText("subscript")}
              >
                <FaSubscript />
              </button>
            </div>
            <div style={modernStyles.toolbarGroup}>
              <button
                style={modernStyles.button}
                onClick={() => formatText("justifyLeft")}
              >
                <FaAlignLeft />
              </button>
              <button
                style={modernStyles.button}
                onClick={() => formatText("justifyCenter")}
              >
                <FaAlignCenter />
              </button>
              <button
                style={modernStyles.button}
                onClick={() => formatText("justifyRight")}
              >
                <FaAlignRight />
              </button>
              <button
                style={modernStyles.button}
                onClick={() => formatText("justifyFull")}
              >
                <FaAlignJustify />
              </button>
            </div>
            <div style={{ ...modernStyles.toolbarGroup, borderRight: "none" }}>
              <button
                style={modernStyles.button}
                onClick={() => formatText("insertUnorderedList")}
              >
                <FaListUl />
              </button>
              <button
                style={modernStyles.button}
                onClick={() => formatText("insertOrderedList")}
              >
                <FaListOl />
              </button>
              <button
                style={modernStyles.button}
                onClick={() => formatText("indent")}
              >
                <FaIndent />
              </button>
              <button
                style={modernStyles.button}
                onClick={() => formatText("outdent")}
              >
                <FaOutdent />
              </button>
              <button style={modernStyles.button} onClick={handleOpenLinkModal}>
                <FaLink />
              </button>
              <button style={modernStyles.button} onClick={handleImage}>
                <FaImage />
              </button>
              <button
                style={modernStyles.button}
                onClick={() => setShowTableModal(true)}
              >
                <FaTable />
              </button>
              <button
                style={modernStyles.button}
                onClick={() => formatText("insertHorizontalRule")}
              >
                <FaRulerHorizontal />
              </button>
              <button
                style={modernStyles.button}
                onClick={handleOpenVideoModal}
              >
                <FaVideo />
              </button>
              <button
                style={modernStyles.button}
                onClick={() => formatText("formatBlock", "<pre>")}
              >
                <FaCode />
              </button>
              <button style={modernStyles.button} onClick={handleViewSource}>
                <FaCode /> Source
              </button>
              <button style={modernStyles.button} onClick={toggleFullScreen}>
                {isFullScreen ? <FaCompress /> : <FaExpand />}
              </button>
            </div>
          </div>

          <div
            ref={editorRef}
            contentEditable
            style={{
              ...modernStyles.editor,
              minHeight: isFullScreen ? "calc(100vh - 180px)" : "50vh",
              maxHeight: isFullScreen ? "calc(100vh - 180px)" : "50vh",
              fontFamily,
              fontSize: `${fontSize}px`,
            }}
            onInput={handleInput}
          />
        </>
      )}

      {viewMode === "preview" && (
        <div
          style={modernStyles.preview}
          dangerouslySetInnerHTML={{ __html: editorContent }}
        />
      )}

      <Modal
        className="rounded-0"
        show={showTableModal}
        onHide={() => setShowTableModal(false)}
      >
        <Modal.Header className="rounded-0" closeButton>
          <Modal.Title>Insert Table</Modal.Title>
        </Modal.Header>
        <Modal.Body className="rounded-0">
          <Tabs defaultActiveKey="basic" id="table-options">
            <Tab eventKey="basic" title="Basic">
              <Form.Group className="mb-3">
                <Form.Label>Rows</Form.Label>
                <Form.Control
                  type="number"
                  value={tableRows}
                  onChange={(e) => setTableRows(parseInt(e.target.value) || 1)}
                  min="1"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Columns</Form.Label>
                <Form.Control
                  type="number"
                  value={tableCols}
                  onChange={(e) => setTableCols(parseInt(e.target.value) || 1)}
                  min="1"
                />
              </Form.Group>
              <Form.Check
                type="checkbox"
                label="Include Header Row"
                checked={headerRow}
                onChange={(e) => setHeaderRow(e.target.checked)}
              />
            </Tab>
            <Tab eventKey="style" title="Style">
              <Form.Group className="mb-3">
                <Form.Label>Table Style</Form.Label>
                <Form.Select
                  value={tableStyle}
                  onChange={(e) => setTableStyle(e.target.value)}
                >
                  <option value="default">Default</option>
                  <option value="striped">Striped</option>
                  <option value="borderless">Borderless</option>
                  <option value="minimal">Minimal</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Width (%)</Form.Label>
                <Form.Control
                  type="number"
                  value={tableWidth}
                  onChange={(e) =>
                    setTableWidth(parseInt(e.target.value) || 100)
                  }
                  min="10"
                  max="100"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Border Width (px)</Form.Label>
                <Form.Control
                  type="number"
                  value={borderWidth}
                  onChange={(e) =>
                    setBorderWidth(parseInt(e.target.value) || 1)
                  }
                  min="0"
                  max="10"
                />
              </Form.Group>
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTableModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleInsertTable}>
            Insert
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showLinkModal} onHide={() => setShowLinkModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Insert Hyperlink</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>URL</Form.Label>
            <FormControl
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Text</Form.Label>
            <FormControl
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="Click here"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLinkModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleInsertLink}>
            Insert
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showVideoModal} onHide={() => setShowVideoModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Insert Video</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Embed Code</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              value={videoEmbed}
              onChange={(e) => setVideoEmbed(e.target.value)}
              placeholder="Paste embed code here"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowVideoModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleInsertVideo}>
            Insert
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showSourceModal}
        onHide={() => setShowSourceModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>HTML Source</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            as="textarea"
            rows={10}
            value={editorContent}
            onChange={(e) => {
              setEditorContent(e.target.value);
              if (editorRef.current)
                editorRef.current.innerHTML = e.target.value;
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSourceModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setShowSourceModal(false)}>
            Apply
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showSavedDocsModal}
        onHide={() => setShowSavedDocsModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Saved Documents</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {savedDocs.length === 0 ? (
            <p>No saved documents found.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {savedDocs.map((doc) => (
                <li
                  key={doc}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: "1px solid #E5E7EB",
                  }}
                >
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => loadDocument(doc)}
                  >
                    {doc}
                  </span>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteDocument(doc)}
                  >
                    <FaTrash />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowSavedDocsModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => formatText("insertImage", e.target.result);
            reader.readAsDataURL(file);
          }
        }}
      />

      <div style={modernStyles.statusBar}>
        Words: {wordCount} | Characters: {charCount} | Last saved:{" "}
        {new Date().toLocaleTimeString()}
      </div>

      {showNotification && (
        <div style={modernStyles.notification}>{notificationMessage}</div>
      )}
    </div>
  );
};

export default JsTextEditor;
