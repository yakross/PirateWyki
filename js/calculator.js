/**
 * Calculadora de costes: nave + blindajes + ranuras drones + ranuras cortex + componentes
 */
(function() {
    const db = window.db;
    if (!db) return;

    let shipsList = [];
    let componentsList = [];
    let selectedShip = null;
    var selectedAdditionalIds = new Set();

    const shipSelect = document.getElementById('shipSelect');
    const shipDetails = document.getElementById('shipDetails');
    const armorsList = document.getElementById('armorsList');
    const droneSlots = document.getElementById('droneSlots');
    const cortexSlots = document.getElementById('cortexSlots');
    const componentTypeFilter = document.getElementById('componentTypeFilter');
    const componentsListContainer = document.getElementById('componentsListContainer');
    const componentSlotsByTypeSection = document.getElementById('componentSlotsByTypeSection');
    const componentSlotsByTypeList = document.getElementById('componentSlotsByTypeList');
    const calcSummary = document.getElementById('calcSummary');
    const calcTotal = document.getElementById('calcTotal');

    function esc(s) { return (s + '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }

    async function loadShips() {
        try {
            const snap = await db.collection('ships').get();
            shipsList = [];
            snap.forEach(doc => shipsList.push({ id: doc.id, ...doc.data() }));
            shipsList.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            shipSelect.innerHTML = '<option value="">-- Selecciona una nave --</option>' +
                shipsList.map(s => '<option value="' + s.id + '">' + esc(s.name || 'Sin nombre') + '</option>').join('');
        } catch (e) {
            console.error('Error cargando naves:', e);
        }
    }

    async function loadComponents() {
        try {
            const snap = await db.collection('components').get();
            componentsList = [];
            snap.forEach(doc => {
                const d = doc.data();
                const cost = d.cost != null ? Number(d.cost) : (d.price != null ? Number(d.price) : 0);
                const type = (d.type || d.Type || '').trim() || '';
                componentsList.push({ id: doc.id, name: d.name || d.Name || 'Sin nombre', cost: cost, type: type });
            });
            componentsList.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            var types = [];
            componentsList.forEach(c => { if (c.type && types.indexOf(c.type) === -1) types.push(c.type); });
            types.sort();
            if (componentTypeFilter) {
                componentTypeFilter.innerHTML = '<option value="">-- Todos los tipos --</option>' + types.map(t => '<option value="' + esc(t) + '">' + esc(t) + '</option>').join('');
                componentTypeFilter.addEventListener('change', renderComponentsByType);
            }
            renderComponentsByType();
        } catch (e) {
            console.error('Error cargando componentes:', e);
        }
    }
    function renderComponentsByType() {
        if (!componentsListContainer) return;
        var typeVal = (componentTypeFilter && componentTypeFilter.value) ? (componentTypeFilter.value || '').trim() : '';
        var list = !typeVal ? componentsList : componentsList.filter(c => (c.type || '') === typeVal);
        componentsListContainer.innerHTML = list.map(function(c) {
            var sel = selectedAdditionalIds.has(c.id);
            return '<div class="calc-component-row' + (sel ? ' selected' : '') + '" data-id="' + esc(c.id) + '" data-type="' + esc(c.type || '') + '" data-cost="' + c.cost + '">' +
                '<span class="calc-component-check"><i class="' + (sel ? 'fas' : 'far') + ' fa-check-circle"></i></span>' +
                '<span class="calc-component-name">' + esc(c.name) + '</span>' +
                '<span class="calc-component-meta">' + (c.type ? esc(c.type) + ' · ' : '') + (c.cost ? c.cost + ' cr' : '') + '</span>' +
                '</div>';
        }).join('');
        componentsListContainer.querySelectorAll('.calc-component-row').forEach(function(row) {
            row.addEventListener('click', function() {
                var id = row.getAttribute('data-id');
                var type = (row.getAttribute('data-type') || '').trim();

                if (selectedAdditionalIds.has(id)) {
                    selectedAdditionalIds.delete(id);
                } else {
                    // Asegurar solo un componente adicional por tipo
                    if (type) {
                        componentsListContainer.querySelectorAll('.calc-component-row').forEach(function(otherRow) {
                            if (otherRow === row) return;
                            var otherType = (otherRow.getAttribute('data-type') || '').trim();
                            if (otherType && otherType.toLowerCase() === type.toLowerCase()) {
                                var otherId = otherRow.getAttribute('data-id');
                                if (otherId && selectedAdditionalIds.has(otherId)) {
                                    selectedAdditionalIds.delete(otherId);
                                    otherRow.classList.remove('selected');
                                    var otherIcon = otherRow.querySelector('.calc-component-check i');
                                    if (otherIcon) otherIcon.className = 'far fa-check-circle';
                                }
                            }
                        });
                    }
                    selectedAdditionalIds.add(id);
                }

                row.classList.toggle('selected', selectedAdditionalIds.has(id));
                var icon = row.querySelector('.calc-component-check i');
                if (icon) icon.className = selectedAdditionalIds.has(id) ? 'fas fa-check-circle' : 'far fa-check-circle';
                updateTotal();
            });
        });
        updateTotal();
    }

    function getSelectedShip() {
        const id = shipSelect.value;
        if (!id) return null;
        return shipsList.find(s => s.id === id) || null;
    }

    function renderArmors(ship) {
        const armors = Array.isArray(ship.armors) ? ship.armors : [];
        if (armors.length === 0) {
            armorsList.innerHTML = '<p class="text-muted small">Esta nave no tiene blindajes definidos.</p>';
            return;
        }
        armorsList.innerHTML = armors.map((a, i) => {
            const cost = a.cost != null ? a.cost : 0;
            const label = (a.type || 'Blindaje ' + (i + 1)) + ' — ' + cost + ' cr';
            return '<label class="d-block mb-2"><input type="checkbox" class="armor-cb me-2" data-cost="' + cost + '"> ' + esc(label) + '</label>';
        }).join('');
    }

    function updateShipDetails() {
        selectedShip = getSelectedShip();
        if (!selectedShip) {
            shipDetails.style.display = 'none';
            if (componentSlotsByTypeSection) componentSlotsByTypeSection.style.display = 'none';
            updateTotal();
            return;
        }
        shipDetails.style.display = 'block';
        renderArmors(selectedShip);
        armorsList.querySelectorAll('.armor-cb').forEach(cb => cb.addEventListener('change', updateTotal));
        renderComponentSlotsByType(selectedShip);
        updateTotal();
    }

    function sumDroneSlotCosts(ship) {
        const arr = Array.isArray(ship.droneSlotCosts) ? ship.droneSlotCosts : [0, 0, 0, 0, 0, 0];
        const n = Math.min(6, Math.max(1, parseInt(droneSlots.value, 10) || 1));
        let sum = 0;
        for (let i = 1; i < n; i++) sum += Number(arr[i]) || 0;
        return sum;
    }

    function sumCortexSlotCosts(ship) {
        const arr = Array.isArray(ship.cortexSlotCosts) ? ship.cortexSlotCosts : [0, 0];
        const n = Math.min(2, Math.max(1, parseInt(cortexSlots.value, 10) || 1));
        if (n < 2) return 0;
        return Number(arr[1]) || 0;
    }

    function getComponentsTotal() {
        let total = 0;
        if (componentSlotsByTypeList) {
            componentSlotsByTypeList.querySelectorAll('select.slot-type-select').forEach(sel => {
                const opt = sel.options[sel.selectedIndex];
                if (opt && opt.value) total += Number(opt.getAttribute('data-cost')) || 0;
            });
        }
        selectedAdditionalIds.forEach(function(id) {
            var c = componentsList.find(function(x) { return x.id === id; });
            if (c) total += Number(c.cost) || 0;
        });
        return total;
    }

    function typeNorm(t) { return (t || '').trim().toLowerCase(); }
    function renderComponentSlotsByType(ship) {
        if (!componentSlotsByTypeSection || !componentSlotsByTypeList) return;
        const types = Array.isArray(ship.componentSlotTypes) ? ship.componentSlotTypes.filter(Boolean) : [];
        if (types.length === 0) {
            componentSlotsByTypeSection.style.display = 'none';
            return;
        }
        componentSlotsByTypeSection.style.display = 'block';
        componentSlotsByTypeList.innerHTML = types.map(slotType => {
            const slotNorm = typeNorm(slotType);
            const list = componentsList.filter(c => slotNorm && typeNorm(c.type) === slotNorm);
            const options = '<option value="">-- Ninguno --</option>' + list.map(c =>
                '<option value="' + c.id + '" data-cost="' + c.cost + '">' + esc(c.name) + (c.cost ? ' (' + c.cost + ' cr)' : '') + '</option>'
            ).join('');
            return '<div class="form-group mb-2"><label class="form-label">' + esc(slotType) + '</label><select class="form-control slot-type-select">' + options + '</select></div>';
        }).join('');
        componentSlotsByTypeList.querySelectorAll('.slot-type-select').forEach(sel => {
            sel.addEventListener('change', updateTotal);
        });
    }

    function getArmorsTotal() {
        let total = 0;
        armorsList.querySelectorAll('.armor-cb:checked').forEach(cb => {
            total += Number(cb.getAttribute('data-cost')) || 0;
        });
        return total;
    }

    function updateTotal() {
        const ship = getSelectedShip();
        let shipCredits = 0;
        let shipRaven = 0;
        let armorsTotal = 0;
        let droneTotal = 0;
        let cortexTotal = 0;
        let componentsTotal = 0;

        if (ship) {
            const req = ship.requirements || {};
            shipCredits = Number(req.credits) || 0;
            shipRaven = Number(ship.creditsRaven) || 0;
            armorsTotal = getArmorsTotal();
            droneTotal = sumDroneSlotCosts(ship);
            cortexTotal = sumCortexSlotCosts(ship);
        }
        componentsTotal = getComponentsTotal();

        const totalCredits = shipCredits + armorsTotal + droneTotal + cortexTotal + componentsTotal;
        const totalRaven = shipRaven;

        const lines = [];
        if (ship) {
            lines.push('<div class="calc-row"><span>Nave (crionita)</span><strong>' + shipCredits.toLocaleString() + '</strong></div>');
            if (shipRaven) lines.push('<div class="calc-row"><span>Nave (Créditos Raven)</span><strong>' + shipRaven.toLocaleString() + '</strong></div>');
            lines.push('<div class="calc-row"><span>Blindajes</span><strong>' + armorsTotal.toLocaleString() + '</strong></div>');
            lines.push('<div class="calc-row"><span>Ranuras drones</span><strong>' + droneTotal.toLocaleString() + '</strong></div>');
            lines.push('<div class="calc-row"><span>Ranuras cortex</span><strong>' + cortexTotal.toLocaleString() + '</strong></div>');
        }
        lines.push('<div class="calc-row"><span>Componentes</span><strong>' + componentsTotal.toLocaleString() + '</strong></div>');

        calcSummary.innerHTML = lines.length ? lines.join('') : '<p class="text-muted">Selecciona una nave para ver el desglose.</p>';
        calcTotal.textContent = 'Total: ' + totalCredits.toLocaleString() + ' crionita' + (totalRaven ? ' · ' + totalRaven.toLocaleString() + ' Créditos Raven' : '');
    }

    shipSelect.addEventListener('change', updateShipDetails);
    droneSlots.addEventListener('change', updateTotal);
    cortexSlots.addEventListener('change', updateTotal);

    function init() {
        loadShips().then(() => {
            loadComponents().then(() => {
                updateShipDetails();
            });
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
