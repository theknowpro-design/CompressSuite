# Synthetic Media Test Phase — QUICK START GUIDE

**Status:** ✅ All test media & documentation ready  
**What to do next:** Begin manual testing

---

## 🚀 3-Minute Quick Start

### Step 1: Verify Files Exist
```
Check: c:\Users\plmaj\OneDrive\CompressSuite\synthetic-test-media/

You should see 17 files:
✅ tiny.png
✅ small.jpg
✅ medium.webp
✅ large.png
✅ xlarge.jpg
✅ zero-byte.jpg
✅ corrupted.jpg
✅ mime-mismatch.jpg
✅ multi-dot.file.name.png
✅ gradient.png
✅ photo.jpg
✅ screenshot.webp
✅ tiny.mp4
✅ small.webm
✅ medium.mov
✅ large.mp4
✅ zero-duration.mp4
```

### Step 2: Open the App
```bash
npm run dev
```

Navigate to http://localhost:5173 or http://127.0.0.1:5173

### Step 3: Start Testing
Upload files from `synthetic-test-media/` folder and verify:
- ✅ Normal files compress
- ✅ Edge cases show proper errors
- ✅ No crashes occur

---

## 📋 Testing Workflow

### Images (12 files)
1. **normal cases:** tiny.png, small.jpg, medium.webp, large.png, xlarge.jpg
2. **edge cases:** zero-byte.jpg, corrupted.jpg, mime-mismatch.jpg, multi-dot.file.name.png
3. **additional:** gradient.png, photo.jpg, screenshot.webp

### Videos (5 files)
1. **normal cases:** tiny.mp4, small.webm, medium.mov, large.mp4
2. **edge case:** zero-duration.mp4

---

## 🧪 Test Checklist

- [ ] Upload tiny.png → Compress successfully
- [ ] Upload xlarge.jpg → Compress successfully
- [ ] Upload zero-byte.jpg → Show error message
- [ ] Upload corrupted.jpg → Show error message
- [ ] Upload mime-mismatch.jpg → Detect type & compress
- [ ] Upload multi-dot.file.name.png → Handle filename
- [ ] Upload tiny.mp4 → Compress successfully
- [ ] Upload large.mp4 → Compress successfully
- [ ] Upload zero-duration.mp4 → Handle gracefully
- [ ] Test slider with 0%, 50%, 100%
- [ ] Verify compression results in file details
- [ ] Test download functionality
- [ ] Test mobile responsiveness
- [ ] Test theme switching
- [ ] Check history after compression

---

## 📊 Expected Behavior

### Normal Compression
- Image compresses to 30-60% of original size
- Video compresses to 40-70% of original size
- Results show in modal with download button

### Error Cases
- **Zero-byte files:** "File appears to be empty" error
- **Corrupted files:** "Failed to load file" error
- **MIME mismatch:** Correct type detected, compression proceeds
- **Large files:** Gracefully rejected if over limit

### UI Responsiveness
- Slider updates compression level
- Results modal appears after compression
- Mobile layout stacks vertically
- No horizontal scrolling

---

## 🆘 Troubleshooting

**"I can't find synthetic-test-media folder"**
→ Check: `dir synthetic-test-media/`
→ Ensure you're in CompressSuite project root

**"File appears to be empty when uploading zero-byte.jpg"**
→ This is expected behavior (edge case)
→ Confirm error message appears

**"App crashes on corrupted file"**
→ This should NOT happen
→ Check: ErrorBoundary is rendering fallback UI
→ Report issue with full error stack

**"Compression takes too long"**
→ Check synthetic-test-media/ folder exists
→ Check synthetic-test-media/ folder exists
→ Verify app is running in dev mode (not production)

---

## ✅ Success Criteria

Phase 2 is complete when:
- [ ] All 17 files tested
- [ ] No unexpected crashes
- [ ] Error cases handled gracefully
- [ ] Compression produces valid output files
- [ ] UI remains responsive throughout
- [ ] Mobile layout works correctly
- [ ] synthetic-test-media/ folder exists
- [ ] All manual tests pass

---

**Status: READY FOR TESTING** ✅

Next: Run `npm run dev` and begin uploading test files!
