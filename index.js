document.addEventListener("DOMContentLoaded", () => {
	const suppliers = document.querySelector('#table');
	const supplierInfo = document.querySelector('#info');
	const supplierForm = document.querySelector('#supplier-form');
	supplierForm.addEventListener('submit', createNewSupplier);

	fetch('http://localhost:3000/suppliers')
		.then((response) => response.json())
		.then((suppliers) => suppliers.forEach(putItOnTheDOM));

	function putItOnTheDOM(supplier) {
		const supplierLi = document.createElement('tr');
		supplierLi.dataset.id = supplier.id;
		supplierLi.innerHTML = `<td scope="row" >${supplier.name}</td> 
								<td scope="row">${supplier.number}</td>
								<td scope="row">${supplier.country}</td>
								<td scope="row">${supplier.city}</td>
								<td scope="row">${supplier.zip_code}</td>`
		suppliers.appendChild(supplierLi);
		
		//Delete Button//

		const buttond = document.createElement('button');
		buttond.dataset.id = supplier.id;
		buttond.setAttribute("id", `delete-button-${supplier.id}`);
		buttond.innerText = "DELETE";
		supplierLi.appendChild(buttond);
		buttond.setAttribute("class", "btn btn-dark");
		buttond.addEventListener('click', () => deleteSupplier(supplier));
		
		//Update Button//

		const buttonu = document.createElement('button');
		buttonu.dataset.id = supplier.id;
		buttonu.setAttribute("id", `update-button-${supplier.id}`);
		buttonu.setAttribute("class", "btn btn-dark");
		buttonu.innerText = "UPDATE";
		supplierLi.appendChild(buttonu);
		buttonu.addEventListener('click', () => editSupplier(supplier));
	}

	function gatherFormData() {
		return {
			name: event.target.supplier_name.value,
			number: event.target.supplier_number.value,
			country: event.target.country.value,
			city: event.target.city.value,
			zip_code: event.target.zip_code.value,
			address1: event.target.address1.value,
			address2: event.target.address2.value,
			iban: event.target.iban.value,
			vat_amount: event.target.vat_amount.value,
			currency: event.target.currency.value,
		};
	}

	// Create Supplier //

	function createNewSupplier(event) {
		event.preventDefault();
		let newSupplier = gatherFormData();
		return fetch('http://localhost:3000/suppliers', {
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			body: JSON.stringify(newSupplier),
		})
			.then((res) => res.json())
			.then((supplier) => putItOnTheDOM(supplier));
	}

	// Update //

	function editSupplier(supplier) {
		const eForm = document.createElement('form');
		eForm.id = "update-form";
		eForm.innerHTML = `
			<h2> Update ${supplier.name}</h2>
			<label for="supplier_name">Supplier name</label><input class="form-control form-control-sm" type="text" name="supplier_name" value="${supplier.name}">
			<label for="supplier_number">Supplier number</label><input class="form-control form-control-sm" type="text" name="supplier_number" value="${supplier.number}">
			<label for="country">Country</label><select class="form-control form-control-sm" id="country" name="country">
			<option value=${supplier.country}>${supplier.country}</option>
			</select>
			<label for="city">City</label><input class="form-control form-control-sm" type="text" name="city" value="${supplier.city}">
			<label for="zip_code">Zip code</label><input class="form-control form-control-sm" type="text" pattern="[0-9]{6}" name="zip_code" value="${supplier.zip_code}">
			<label for="address1">Address 1</label><input class="form-control form-control-sm" type="text" name="address1" value="${supplier.address1}">
			<label for="address2">Address 2</label><input class="form-control form-control-sm" type="text" name="address2" value="${supplier.address2}">
			<label for="iban">Iban</label><input class="form-control form-control-sm" type="text" name="iban" value="${supplier.iban}">
			<label for="vat_amount">Vat amount</label><select class="form-control form-control-sm" id="vat_amount" name="vat_amount">
			<option value=${supplier.vat_amount}>${supplier.vat_amount}</option>
			</select>
			<label for="currency">Currency</label><select class="form-control form-control-sm" id="currency" name="currency">
			<option value=${supplier.currency}>${supplier.currency}</option>
			</select><br>
			<input class="btn btn-dark" type="submit" name="">
		`;
		supplierInfo.append(eForm);
		eForm.addEventListener('submit', (event) => updateSupplier(event, supplier));
	}

	function updateSupplier(event, supplier) {
		event.preventDefault();
		let updatedSupplier = gatherFormData();
		updateOnBackend(updatedSupplier, supplier.id).then(updateOnFrontEnd);
	}

	function updateOnBackend(updatedSupplier, id) {
		return fetch(`http://localhost:3000/suppliers/${id}`, {
			method: "PATCH",
			body: JSON.stringify(updatedSupplier),
			headers: {
				'Content-Type': 'application/json',
			},
		}).then((res) => res.json());
	}

	function updateOnFrontEnd(supplier) {
		const supplierSpan = suppliers.querySelector(
			`li[data-id="${supplier.id}"]>span`
		);
		supplierSpan.innerText = `${supplier.supplier_name} the ${supplier.supplier_number}`;
	}

	// Delete //

	function deleteSupplier(supplier) {
		const supplierLi = document.querySelector(`[data-id="${supplier.id}"]`);
		const buttond = document.querySelector(`#delete-button-${supplier.id}`);
		const buttonu = document.querySelector(`#update-button-${supplier.id}`);

		return fetch(`http://localhost:3000/suppliers/${supplier.id}`, {
			method: "DELETE",
		})
			.then((response) => response.json())
			.then(() => {
				supplierLi.remove();
				buttond.remove();
				buttonu.remove();
			})
	}
});
