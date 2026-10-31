document.addEventListener("DOMContentLoaded", function () {
    const picker = document.querySelector("[data-tjs-custom-variant-picker]");
    if (!picker) return;

    const selectedTitleEl = picker.querySelector("[data-tjs-selected-variant-title]");
    const customNameBox = picker.querySelector("[data-tjs-custom-name-box]");
    const customNameInput = picker.querySelector("[data-tjs-custom-name-input]");
    const customNameError = picker.querySelector("[data-tjs-custom-name-error]");
    const namePreviewText = picker.querySelector("[data-tjs-name-preview-text]");
    const variantRadios = picker.querySelectorAll('input[name="tjs-planner-variant"]');

    const productForm =
      picker.closest("section")?.querySelector('form[action*="/cart/add"]') ||
      document.querySelector('form[action*="/cart/add"]');

    if (!productForm) return;

    const formVariantInput =
      productForm.querySelector('input[name="id"]') ||
      productForm.querySelector('select[name="id"]');

    function isCustomisationVariant(title) {
      const cleanTitle = title.toLowerCase();
      return cleanTitle.includes("add your name") || cleanTitle.includes("name customisation") || cleanTitle.includes("personalised name") || cleanTitle.includes("personalized name");
    }

    function getOrCreatePropertyInput() {
      let propertyInput = productForm.querySelector('input[name="properties[Name Customisation]"]');

      if (!propertyInput) {
        propertyInput = document.createElement("input");
        propertyInput.type = "hidden";
        propertyInput.name = "properties[Name Customisation]";
        productForm.appendChild(propertyInput);
      }

      return propertyInput;
    }

    function removePropertyInput() {
      const propertyInput = productForm.querySelector('input[name="properties[Name Customisation]"]');
      if (propertyInput) propertyInput.remove();
    }

    function formatPreviewName(name) {
      const cleanName = name.trim();
      if (!cleanName) return "ANUSHKA";
      return cleanName.toUpperCase();
    }

    function animateNamePreview() {
      if (!namePreviewText) return;

      namePreviewText.classList.remove("tjs-name-pop");
      void namePreviewText.offsetWidth;
      namePreviewText.classList.add("tjs-name-pop");
    }

    function updateNamePreview() {
      if (!namePreviewText || !customNameInput) return;

      namePreviewText.textContent = formatPreviewName(customNameInput.value);
      animateNamePreview();
    }

    function updateCustomNameVisibility(variantTitle) {
      if (isCustomisationVariant(variantTitle)) {
        customNameBox.classList.add("is-visible");
        customNameInput.setAttribute("required", "required");
        updateNamePreview();
      } else {
        customNameBox.classList.remove("is-visible");
        customNameInput.removeAttribute("required");
        customNameInput.value = "";
        customNameError.classList.remove("is-visible");
        removePropertyInput();

        if (namePreviewText) {
          namePreviewText.textContent = "ANUSHKA";
        }
      }
    }

    function updateVariantSelection(radio) {
      const variantId = radio.value;
      const variantTitle = radio.getAttribute("data-variant-title") || "";

      if (selectedTitleEl) selectedTitleEl.textContent = variantTitle;

      if (formVariantInput) {
        formVariantInput.value = variantId;
        formVariantInput.dispatchEvent(new Event("change", { bubbles: true }));
      }

      updateCustomNameVisibility(variantTitle);
    }

    variantRadios.forEach(function (radio) {
      radio.addEventListener("change", function () {
        if (radio.checked) updateVariantSelection(radio);
      });

      if (radio.checked) {
        updateVariantSelection(radio);
      }
    });

    customNameInput.addEventListener("input", function () {
      customNameError.classList.remove("is-visible");
      updateNamePreview();

      const checkedRadio = picker.querySelector('input[name="tjs-planner-variant"]:checked');
      if (!checkedRadio) return;

      const variantTitle = checkedRadio.getAttribute("data-variant-title") || "";

      if (isCustomisationVariant(variantTitle)) {
        const propertyInput = getOrCreatePropertyInput();
        propertyInput.value = customNameInput.value.trim();
      }
    });

    formVariantInput?.addEventListener("change", function () {
      const radio = Array.from(variantRadios).find(item => item.value === formVariantInput.value);
      if (!radio) return;
      radio.checked = true;
      const title = radio.getAttribute("data-variant-title") || "";
      if (selectedTitleEl) selectedTitleEl.textContent = title;
      updateCustomNameVisibility(title);
    });

    // This custom layout has no standard main product form for the native sticky observer.
    const productSection = picker.closest(".shopify-section");
    const stickyBar = productSection?.querySelector("hdt-sticky-btn-atc");
    const mainAtc = productSection?.querySelector("[data-tjs-custom-atc]");
    if (stickyBar && mainAtc && !document.getElementById(stickyBar.getAttribute("form"))) {
      const stickyObserver = new IntersectionObserver(function (entries) {
        const entry = entries[0];
        document.body.classList.toggle("sticky-shown", !entry.isIntersecting && entry.boundingClientRect.bottom < 0);
      });
      stickyObserver.observe(mainAtc);
      document.addEventListener("shopify:section:unload", function (event) {
        if (event.target.contains(stickyBar)) {
          stickyObserver.disconnect();
          document.body.classList.remove("sticky-shown");
        }
      });
    }

    function validatePersonalisation(event) {
      const checkedRadio = picker.querySelector('input[name="tjs-planner-variant"]:checked');
      if (!checkedRadio) return;

      const variantTitle = checkedRadio.getAttribute("data-variant-title") || "";

      if (isCustomisationVariant(variantTitle)) {
        const customName = customNameInput.value.trim();

        if (!customName || customName.length > 24) {
          event.preventDefault();
          event.stopImmediatePropagation();

          customNameError.classList.add("is-visible");
          customNameInput.focus();
          return false;
        }

        const propertyInput = getOrCreatePropertyInput();
        propertyInput.value = customName;
      } else {
        removePropertyInput();
      }
    }

    document.addEventListener("submit", function (event) {
      if (event.target === productForm) validatePersonalisation(event);
    }, true);
    document.addEventListener("click", function (event) {
      const submit = event.target.closest('button[type="submit"], input[type="submit"]');
      if (submit?.form === productForm) validatePersonalisation(event);
    }, true);
  });
