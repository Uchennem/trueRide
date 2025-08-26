const form = document.querySelector("#updateForm")
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector("#editSubmitBtn")
      updateBtn.removeAttribute("disabled")
    })