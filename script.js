/* =========================================================
   🧪 BIOCHEM LAB HUB
   Complete JavaScript
   ========================================================= */


/* =========================================================
   MENU & NAVIGATION
   ========================================================= */

function openMenu() {
    const menu = document.getElementById("sideMenu");
    const overlay = document.getElementById("menuOverlay");

    if (menu) {
        menu.classList.add("open");
        menu.style.display = "block";
        menu.style.visibility = "visible";
        menu.style.opacity = "1";
    }

    if (overlay) {
        overlay.classList.add("show");
        overlay.style.display = "block";
        overlay.style.visibility = "visible";
        overlay.style.opacity = "1";
    }
}


function closeMenu() {
    const menu = document.getElementById("sideMenu");
    const overlay = document.getElementById("menuOverlay");

    if (menu) {
        menu.classList.remove("open");
        menu.style.display = "none";
        menu.style.visibility = "hidden";
        menu.style.opacity = "0";
    }

    if (overlay) {
        overlay.classList.remove("show");
        overlay.style.display = "none";
        overlay.style.visibility = "hidden";
        overlay.style.opacity = "0";
    }
}


/* =========================================================
   SHOW SECTION
   ========================================================= */

function showSection(sectionId) {

    if (!sectionId) {
        console.error("No section ID provided.");
        return;
    }

    const section = document.getElementById(sectionId);

    if (!section) {
        console.error("Section not found:", sectionId);
        return;
    }

    /* Hide every section */
    const sections = document.querySelectorAll(".section");

    sections.forEach(function(item) {
        item.classList.remove("active");
        item.style.display = "none";
    });

    /* Show selected section */
    section.classList.add("active");
    section.style.display = "block";

    /* Close menu */
    closeMenu();

    /* Scroll to top */
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    console.log("Opened section:", sectionId);
}


/* =========================================================
   HELPER FUNCTIONS
   ========================================================= */

function getNumber(id) {

    const element = document.getElementById(id);

    if (!element) {
        console.error("Input not found:", id);
        return NaN;
    }

    return parseFloat(element.value);
}


function setResult(id, message) {

    const element = document.getElementById(id);

    if (element) {
        element.innerHTML = message;
    }
}


/* =========================================================
   1. MOLARITY
   ========================================================= */

function calculateMolarity() {

    const moles = getNumber("moles");
    const volume = getNumber("volume");

    if (
        !Number.isFinite(moles) ||
        !Number.isFinite(volume) ||
        volume <= 0
    ) {
        setResult(
            "molarityResult",
            "Please enter valid values."
        );
        return;
    }

    const result = moles / volume;

    setResult(
        "molarityResult",
        `Molarity = <strong>${result.toFixed(4)} M</strong>`
    );
}


/* =========================================================
   2. DILUTION
   C1V1 = C2V2
   ========================================================= */

function calculateDilution() {

    const c1 = getNumber("c1");
    const v1 = getNumber("v1");
    const c2 = getNumber("c2");
    const v2 = getNumber("v2");

    const values = [c1, v1, c2, v2];

    const missing =
        values.filter(value => !Number.isFinite(value)).length;

    if (missing > 1) {

        setResult(
            "dilutionResult",
            "Enter any three values to calculate the fourth."
        );

        return;
    }

    if (missing === 1) {

        if (!Number.isFinite(c1)) {

            if (v1 <= 0 || v2 <= 0 || c2 < 0) {
                setResult("dilutionResult", "Invalid values.");
                return;
            }

            const result = (c2 * v2) / v1;

            setResult(
                "dilutionResult",
                `C₁ = <strong>${result.toFixed(4)}</strong>`
            );
        }

        else if (!Number.isFinite(v1)) {

            if (c1 <= 0 || v2 <= 0 || c2 < 0) {
                setResult("dilutionResult", "Invalid values.");
                return;
            }

            const result = (c2 * v2) / c1;

            setResult(
                "dilutionResult",
                `V₁ = <strong>${result.toFixed(4)}</strong>`
            );
        }

        else if (!Number.isFinite(c2)) {

            if (c1 < 0 || v1 <= 0 || v2 <= 0) {
                setResult("dilutionResult", "Invalid values.");
                return;
            }

            const result = (c1 * v1) / v2;

            setResult(
                "dilutionResult",
                `C₂ = <strong>${result.toFixed(4)}</strong>`
            );
        }

        else if (!Number.isFinite(v2)) {

            if (c2 <= 0 || c1 < 0 || v1 <= 0) {
                setResult("dilutionResult", "Invalid values.");
                return;
            }

            const result = (c1 * v1) / c2;

            setResult(
                "dilutionResult",
                `V₂ = <strong>${result.toFixed(4)}</strong>`
            );
        }

        return;
    }

    const left = c1 * v1;
    const right = c2 * v2;

    const difference = Math.abs(left - right);

    if (difference < 0.000001) {

        setResult(
            "dilutionResult",
            "✓ Values are consistent with C₁V₁ = C₂V₂."
        );

    } else {

        setResult(
            "dilutionResult",
            `Values are not consistent.<br>
             C₁V₁ = ${left.toFixed(4)}<br>
             C₂V₂ = ${right.toFixed(4)}`
        );
    }
}


/* =========================================================
   3. MOLECULAR WEIGHT
   ========================================================= */

const atomicMasses = {

    H: 1.008,
    C: 12.011,
    N: 14.007,
    O: 15.999,
    P: 30.974,
    S: 32.06,
    Na: 22.990,
    K: 39.098,
    Cl: 35.45,
    Ca: 40.078,
    Mg: 24.305,
    Fe: 55.845,
    Zn: 65.38,
    Cu: 63.546,
    Mn: 54.938,
    Co: 58.933,
    Ni: 58.693,
    F: 18.998,
    I: 126.904,
    Br: 79.904,
    Si: 28.085
};


function parseFormula(formula) {

    formula = formula.replace(/\s+/g, "");

    function parseSection(text) {

        let total = 0;
        let i = 0;

        while (i < text.length) {

            if (text[i] === "(") {

                let depth = 1;
                let start = i + 1;

                i++;

                while (
                    i < text.length &&
                    depth > 0
                ) {

                    if (text[i] === "(") depth++;
                    if (text[i] === ")") depth--;

                    i++;
                }

                const inside =
                    text.substring(start, i - 1);

                let number = "";

                while (
                    i < text.length &&
                    /[0-9.]/.test(text[i])
                ) {
                    number += text[i];
                    i++;
                }

                const multiplier =
                    number ? parseFloat(number) : 1;

                total +=
                    parseSection(inside) * multiplier;

            } else {

                let element = text[i];

                if (!/[A-Z]/.test(element)) {
                    throw new Error("Invalid formula.");
                }

                i++;

                if (
                    i < text.length &&
                    /[a-z]/.test(text[i])
                ) {
                    element += text[i];
                    i++;
                }

                if (!(element in atomicMasses)) {
                    throw new Error(
                        "Unknown element: " + element
                    );
                }

                let number = "";

                while (
                    i < text.length &&
                    /[0-9.]/.test(text[i])
                ) {
                    number += text[i];
                    i++;
                }

                const count =
                    number ? parseFloat(number) : 1;

                total +=
                    atomicMasses[element] * count;
            }
        }

        return total;
    }

    return parseSection(formula);
}


function calculateMolecularWeight() {

    const input =
        document.getElementById("formulaInput");

    if (!input) return;

    const formula =
        input.value.trim();

    if (!formula) {

        setResult(
            "molecularWeightResult",
            "Enter a chemical formula."
        );

        return;
    }

    try {

        const weight =
            parseFormula(formula);

        setResult(
            "molecularWeightResult",
            `${formula} = <strong>${weight.toFixed(3)} g/mol</strong>`
        );

    } catch (error) {

        setResult(
            "molecularWeightResult",
            "Invalid or unsupported chemical formula."
        );
    }
}


/* =========================================================
   4. MOLALITY
   ========================================================= */

function calculateMolality() {

    const moles =
        getNumber("molalityMoles");

    const kg =
        getNumber("solventKg");

    if (
        !Number.isFinite(moles) ||
        !Number.isFinite(kg) ||
        kg <= 0
    ) {

        setResult(
            "molalityResult",
            "Please enter valid values."
        );

        return;
    }

    const result = moles / kg;

    setResult(
        "molalityResult",
        `Molality = <strong>${result.toFixed(4)} mol/kg</strong>`
    );
}


/* =========================================================
   5. NORMALITY
   ========================================================= */

function calculateNormality() {

    const moles =
        getNumber("normalMoles");

    const volume =
        getNumber("normalVolume");

    if (
        !Number.isFinite(moles) ||
        !Number.isFinite(volume) ||
        volume <= 0
    ) {

        setResult(
            "normalityResult",
            "Please enter valid values."
        );

        return;
    }

    const result = moles / volume;

    setResult(
        "normalityResult",
        `Normality = <strong>${result.toFixed(4)} N</strong>`
    );
}


/* =========================================================
   6. pH
   ========================================================= */

function calculatePH() {

    const h =
        getNumber("hydrogen");

    if (
        !Number.isFinite(h) ||
        h <= 0
    ) {

        setResult(
            "phResult",
            "Enter a positive H⁺ concentration."
        );

        return;
    }

    const result =
        -Math.log10(h);

    setResult(
        "phResult",
        `pH = <strong>${result.toFixed(3)}</strong>`
    );
}


/* =========================================================
   7. pOH
   ========================================================= */

function calculatePOH() {

    const oh =
        getNumber("hydroxide");

    if (
        !Number.isFinite(oh) ||
        oh <= 0
    ) {

        setResult(
            "pohResult",
            "Enter a positive OH⁻ concentration."
        );

        return;
    }

    const result =
        -Math.log10(oh);

    setResult(
        "pohResult",
        `pOH = <strong>${result.toFixed(3)}</strong><br>
         At 25°C, pH ≈ ${(14 - result).toFixed(3)}`
    );
}


/* =========================================================
   8. BUFFER
   ========================================================= */

function calculateBuffer() {

    const pka =
        getNumber("pka");

    const base =
        getNumber("baseConcentration");

    const acid =
        getNumber("acidConcentration");

    if (
        !Number.isFinite(pka) ||
        !Number.isFinite(base) ||
        !Number.isFinite(acid) ||
        base <= 0 ||
        acid <= 0
    ) {

        setResult(
            "bufferResult",
            "Please enter valid concentrations."
        );

        return;
    }

    const ph =
        pka + Math.log10(base / acid);

    setResult(
        "bufferResult",
        `pH = <strong>${ph.toFixed(3)}</strong>`
    );
}


/* =========================================================
   9. BEER-LAMBERT LAW
   ========================================================= */

function calculateBeer() {

    const epsilon =
        getNumber("epsilon");

    const concentration =
        getNumber("beerConcentration");

    const path =
        getNumber("pathLength");

    if (
        !Number.isFinite(epsilon) ||
        !Number.isFinite(concentration) ||
        !Number.isFinite(path) ||
        path <= 0
    ) {

        setResult(
            "beerResult",
            "Please enter valid values."
        );

        return;
    }

    const absorbance =
        epsilon * concentration * path;

    setResult(
        "beerResult",
        `Absorbance = <strong>${absorbance.toFixed(4)}</strong>`
    );
}


/* =========================================================
   10. ENZYME ACTIVITY
   ========================================================= */

function calculateEnzymeActivity() {

    const product =
        getNumber("productAmount");

    const time =
        getNumber("reactionTime");

    if (
        !Number.isFinite(product) ||
        !Number.isFinite(time) ||
        time <= 0
    ) {

        setResult(
            "enzymeResult",
            "Please enter valid values."
        );

        return;
    }

    const activity =
        product / time;

    setResult(
        "enzymeResult",
        `Enzyme Activity = <strong>${activity.toFixed(4)} amount/time</strong>`
    );
}


/* =========================================================
   11. SPECIFIC ACTIVITY
   ========================================================= */

function calculateSpecificActivity() {

    const activity =
        getNumber("enzymeActivity");

    const protein =
        getNumber("proteinMass");

    if (
        !Number.isFinite(activity) ||
        !Number.isFinite(protein) ||
        protein <= 0
    ) {

        setResult(
            "specificActivityResult",
            "Please enter valid values."
        );

        return;
    }

    const result =
        activity / protein;

    setResult(
        "specificActivityResult",
        `Specific Activity = <strong>${result.toFixed(4)} U/mg</strong>`
    );
}


/* =========================================================
   12. MICHAELIS-MENTEN
   ========================================================= */

function calculateKmVmax() {

    const vmax =
        getNumber("vmax");

    const substrate =
        getNumber("substrate");

    const km =
        getNumber("km");

    if (
        !Number.isFinite(vmax) ||
        !Number.isFinite(substrate) ||
        !Number.isFinite(km) ||
        km + substrate <= 0
    ) {

        setResult(
            "kmvmaxResult",
            "Please enter valid values."
        );

        return;
    }

    const velocity =
        (vmax * substrate) /
        (km + substrate);

    setResult(
        "kmvmaxResult",
        `Reaction velocity (v) = <strong>${velocity.toFixed(4)}</strong>`
    );
}


/* =========================================================
   13. PROTEIN CONCENTRATION
   ========================================================= */

function calculateProteinConcentration() {

    const absorbance =
        getNumber("proteinAbsorbance");

    const coefficient =
        getNumber("proteinCoefficient");

    if (
        !Number.isFinite(absorbance) ||
        !Number.isFinite(coefficient) ||
        coefficient <= 0
    ) {

        setResult(
            "proteinResult",
            "Please enter valid values."
        );

        return;
    }

    const concentrationM =
        absorbance / coefficient;

    const concentrationUM =
        concentrationM * 1e6;

    setResult(
        "proteinResult",
        `Concentration = <strong>${concentrationM.toExponential(3)} M</strong><br>
         = ${concentrationUM.toFixed(3)} µM`
    );
}


/* =========================================================
   14. DNA GC CONTENT
   ========================================================= */

function cleanDNA(sequence) {

    return sequence
        .toUpperCase()
        .replace(/\s+/g, "")
        .replace(/[^ATGC]/g, "");
}


function calculateGC() {

    const input =
        document.getElementById("dnaSequence");

    if (!input) return;

    const sequence =
        cleanDNA(input.value);

    if (!sequence) {

        setResult(
            "gcResult",
            "Enter a valid DNA sequence."
        );

        return;
    }

    const gc =
        (
            sequence
                .split("")
                .filter(base =>
                    base === "G" ||
                    base === "C"
                ).length /
            sequence.length
        ) * 100;

    setResult(
        "gcResult",
        `GC Content = <strong>${gc.toFixed(2)}%</strong><br>
         Sequence length = ${sequence.length} bases`
    );
}


/* =========================================================
   15. DNA MOLECULAR WEIGHT
   ========================================================= */

function calculateDNAWeight() {

    const input =
        document.getElementById("dnaWeightSequence");

    if (!input) return;

    const sequence =
        cleanDNA(input.value);

    if (!sequence) {

        setResult(
            "dnaWeightResult",
            "Enter a valid DNA sequence."
        );

        return;
    }

    const weight =
        sequence.length * 309;

    setResult(
        "dnaWeightResult",
        `Approximate DNA molecular weight =
        <strong>${weight.toLocaleString()} Da</strong><br>
        Length = ${sequence.length} nucleotides`
    );
}


/* =========================================================
   16. DNA COMPLEMENT
   ========================================================= */

function calculateComplement() {

    const input =
        document.getElementById("complementSequence");

    if (!input) return;

    const sequence =
        cleanDNA(input.value);

    if (!sequence) {

        setResult(
            "complementResult",
            "Enter a valid DNA sequence."
        );

        return;
    }

    const complementMap = {

        A: "T",
        T: "A",
        G: "C",
        C: "G"
    };

    const complement =
        sequence
            .split("")
            .map(base => complementMap[base])
            .join("");

    const reverseComplement =
        complement
            .split("")
            .reverse()
            .join("");

    setResult(
        "complementResult",
        `Complement: <strong>${complement}</strong><br><br>
         Reverse Complement: <strong>${reverseComplement}</strong>`
    );
}


/* =========================================================
   17. DNA/RNA CONCENTRATION
   ========================================================= */

function calculateDNAConcentration() {

    const a260 =
        getNumber("a260");

    const factor =
        getNumber("nucleicAcidFactor");

    if (
        !Number.isFinite(a260) ||
        !Number.isFinite(factor) ||
        a260 < 0 ||
        factor <= 0
    ) {

        setResult(
            "dnaRnaResult",
            "Please enter valid values."
        );

        return;
    }

    const concentration =
        a260 * factor;

    setResult(
        "dnaRnaResult",
        `Concentration = <strong>${concentration.toFixed(2)} ng/µL</strong><br>
         A260 is the absorbance reading measured at 260 nm.`
    );
}


/* =========================================================
   18. DNA MELTING TEMPERATURE
   ========================================================= */

function calculateMeltingTemperature() {

    const input =
        document.getElementById("tmSequence");

    if (!input) return;

    const sequence =
        cleanDNA(input.value);

    if (!sequence) {

        setResult(
            "meltingResult",
            "Enter a valid DNA sequence."
        );

        return;
    }

    const length =
        sequence.length;

    const a =
        (sequence.match(/A/g) || []).length;

    const t =
        (sequence.match(/T/g) || []).length;

    const g =
        (sequence.match(/G/g) || []).length;

    const c =
        (sequence.match(/C/g) || []).length;

    let tm;

    if (length < 14) {

        tm =
            2 * (a + t) +
            4 * (g + c);

    } else {

        tm =
            64.9 +
            41 *
            ((g + c - 16.4) / length);
    }

    setResult(
        "meltingResult",
        `Estimated Tm = <strong>${tm.toFixed(2)} °C</strong><br>
         Length = ${length} bases`
    );
}


/* =========================================================
   19. A260/A280 PURITY
   ========================================================= */

function calculatePurity() {

    const a260 =
        getNumber("a260Purity");

    const a280 =
        getNumber("a280Purity");

    if (
        !Number.isFinite(a260) ||
        !Number.isFinite(a280) ||
        a280 <= 0
    ) {

        setResult(
            "purityResult",
            "Please enter valid values."
        );

        return;
    }

    const ratio =
        a260 / a280;

    let interpretation;

    if (
        ratio >= 1.8 &&
        ratio <= 2.0
    ) {

        interpretation =
            "Good nucleic acid purity range.";

    } else if (ratio < 1.8) {

        interpretation =
            "May indicate protein or other contamination.";

    } else {

        interpretation =
            "Higher than the typical DNA purity range.";
    }

    setResult(
        "purityResult",
        `A260/A280 = <strong>${ratio.toFixed(2)}</strong><br>
         ${interpretation}`
    );
}


/* =========================================================
   20. UNIT CONVERTER
   ========================================================= */

function convertUnit() {

    const value =
        getNumber("unitValue");

    const typeElement =
        document.getElementById("unitType");

    if (
        !Number.isFinite(value) ||
        !typeElement
    ) {

        setResult(
            "unitResult",
            "Enter a valid value."
        );

        return;
    }

    const type =
        typeElement.value;

    let result;
    let text;

    switch (type) {

        case "mlL":

            result = value / 1000;
            text = `${value} mL = ${result} L`;

            break;

        case "lMl":

            result = value * 1000;
            text = `${value} L = ${result} mL`;

            break;

        case "ugMg":

            result = value / 1000;
            text = `${value} µg = ${result} mg`;

            break;

        case "mgUg":

            result = value * 1000;
            text = `${value} mg = ${result} µg`;

            break;

        case "mgG":

            result = value / 1000;
            text = `${value} mg = ${result} g`;

            break;

        case "gMg":

            result = value * 1000;
            text = `${value} g = ${result} mg`;

            break;

        case "ulMl":

            result = value / 1000;
            text = `${value} µL = ${result} mL`;

            break;

        case "mlUl":

            result = value * 1000;
            text = `${value} mL = ${result} µL`;

            break;

        default:

            text =
                "Select a conversion type.";
    }

    setResult(
        "unitResult",
        text
    );
}


/* =========================================================
   21. PERCENTAGE CONCENTRATION
   ========================================================= */

function calculatePercentage() {

    const solute =
        getNumber("soluteAmount");

    const solution =
        getNumber("solutionAmount");

    if (
        !Number.isFinite(solute) ||
        !Number.isFinite(solution) ||
        solution <= 0
    ) {

        setResult(
            "percentageResult",
            "Please enter valid values."
        );

        return;
    }

    const result =
        (solute / solution) * 100;

    setResult(
        "percentageResult",
        `Percentage concentration = <strong>${result.toFixed(2)}%</strong>`
    );
}


/* =========================================================
   22. SERIAL DILUTION
   ========================================================= */

function calculateSerialDilution() {

    const initial =
        getNumber("serialInitial");

    const factor =
        getNumber("serialFactor");

    const steps =
        getNumber("serialSteps");

    if (
        !Number.isFinite(initial) ||
        !Number.isFinite(factor) ||
        !Number.isFinite(steps) ||
        initial <= 0 ||
        factor <= 0 ||
        steps <= 0
    ) {

        setResult(
            "serialResult",
            "Please enter valid values."
        );

        return;
    }

    const numberOfSteps =
        Math.floor(steps);

    let html = "";

    for (
        let i = 1;
        i <= numberOfSteps;
        i++
    ) {

        const concentration =
            initial /
            Math.pow(factor, i);

        html +=
            `Step ${i}: <strong>${concentration.toExponential(4)}</strong><br>`;
    }

    setResult(
        "serialResult",
        html
    );
}


/* =========================================================
   23. RCF
   ========================================================= */

function calculateRCF() {

    const rpm =
        getNumber("rpm");

    const radius =
        getNumber("radius");

    if (
        !Number.isFinite(rpm) ||
        !Number.isFinite(radius) ||
        rpm < 0 ||
        radius <= 0
    ) {

        setResult(
            "rcfResult",
            "Please enter valid values."
        );

        return;
    }

    const rcf =
        1.118e-5 *
        radius *
        Math.pow(rpm, 2);

    setResult(
        "rcfResult",
        `RCF = <strong>${rcf.toFixed(2)} × g</strong>`
    );
}


/* =========================================================
   24. PROTEIN MOLECULAR WEIGHT
   ========================================================= */

const aminoAcidMasses = {

    A: 89.09,
    R: 174.20,
    N: 132.12,
    D: 133.10,
    C: 121.15,
    E: 147.13,
    Q: 146.14,
    G: 75.07,
    H: 155.16,
    I: 131.17,
    L: 131.17,
    K: 146.19,
    M: 149.21,
    F: 165.19,
    P: 115.13,
    S: 105.09,
    T: 119.12,
    W: 204.23,
    Y: 181.19,
    V: 117.15
};


function cleanProteinSequence(sequence) {

    return sequence
        .toUpperCase()
        .replace(/\s+/g, "")
        .replace(
            /[^ARNDCQEGHILKMFPSTWYV]/g,
            ""
        );
}


function calculateProteinWeight() {

    const input =
        document.getElementById("proteinSequence");

    if (!input) return;

    const sequence =
        cleanProteinSequence(input.value);

    if (!sequence) {

        setResult(
            "proteinWeightResult",
            "Enter a valid protein sequence."
        );

        return;
    }

    let weight = 18.015;

    for (const aminoAcid of sequence) {

        weight +=
            aminoAcidMasses[aminoAcid] -
            18.015;
    }

    setResult(
        "proteinWeightResult",
        `Approximate molecular weight =
        <strong>${weight.toFixed(2)} Da</strong><br>
        Length = ${sequence.length} amino acids`
    );
}


/* =========================================================
   25. AMINO ACID CALCULATOR
   ========================================================= */

function calculateAminoAcid() {

    const input =
        document.getElementById("aminoSequence");

    if (!input) return;

    const sequence =
        cleanProteinSequence(input.value);

    if (!sequence) {

        setResult(
            "aminoResult",
            "Enter a valid amino acid sequence."
        );

        return;
    }

    const counts = {};

    Object.keys(aminoAcidMasses)
        .forEach(function(amino) {

            counts[amino] = 0;

        });

    sequence
        .split("")
        .forEach(function(amino) {

            counts[amino]++;

        });

    let html =
        `<strong>Length:</strong> ${sequence.length} amino acids<br><br>`;

    html +=
        "<strong>Amino acid composition:</strong><br>";

    Object.keys(counts)
        .forEach(function(amino) {

            if (counts[amino] > 0) {

                const percentage =
                    (
                        counts[amino] /
                        sequence.length
                    ) * 100;

                html +=
                    `${amino}: ${counts[amino]} (${percentage.toFixed(1)}%)<br>`;
            }
        });

    setResult(
        "aminoResult",
        html
    );
}


/* =========================================================
   26. ABSORBANCE → CONCENTRATION
   ========================================================= */

function calculateAbsorbanceConcentration() {

    const absorbance =
        getNumber("absorbanceValue");

    const epsilon =
        getNumber("absEpsilon");

    const path =
        getNumber("absPath");

    if (
        !Number.isFinite(absorbance) ||
        !Number.isFinite(epsilon) ||
        !Number.isFinite(path) ||
        epsilon <= 0 ||
        path <= 0
    ) {

        setResult(
            "absorbanceResult",
            "Please enter valid values."
        );

        return;
    }

    const concentration =
        absorbance /
        (epsilon * path);

    setResult(
        "absorbanceResult",
        `Concentration = <strong>${concentration.toExponential(4)} M</strong>`
    );
}


/* =========================================================
   27. FORMULA LIBRARY
   ========================================================= */

const formulas = [

    {
        name: "Molarity",
        formula: "M = moles / volume (L)",
        description:
            "Concentration expressed as moles per litre."
    },

    {
        name: "Dilution",
        formula: "C₁V₁ = C₂V₂",
        description:
            "Used to calculate concentrations and volumes during dilution."
    },

    {
        name: "Molality",
        formula: "m = moles / kg solvent",
        description:
            "Moles of solute per kilogram of solvent."
    },

    {
        name: "Normality",
        formula: "N = equivalents / litre",
        description:
            "Concentration expressed as equivalents per litre."
    },

    {
        name: "pH",
        formula: "pH = −log[H⁺]",
        description:
            "Measures hydrogen ion concentration."
    },

    {
        name: "pOH",
        formula: "pOH = −log[OH⁻]",
        description:
            "Measures hydroxide ion concentration."
    },

    {
        name: "Henderson-Hasselbalch",
        formula: "pH = pKa + log([A⁻]/[HA])",
        description:
            "Used for buffer calculations."
    },

    {
        name: "Beer-Lambert Law",
        formula: "A = εcl",
        description:
            "Relates absorbance to concentration."
    },

    {
        name: "Michaelis-Menten",
        formula: "v = Vmax[S]/(Km + [S])",
        description:
            "Describes enzyme reaction velocity."
    },

    {
        name: "Specific Activity",
        formula:
            "Specific activity = activity / protein mass",
        description:
            "Used to evaluate enzyme purity."
    },

    {
        name: "DNA GC Content",
        formula:
            "GC% = (G+C)/total × 100",
        description:
            "Percentage of guanine and cytosine in DNA."
    },

    {
        name: "A260/A280",
        formula:
            "Purity = A260 / A280",
        description:
            "Common nucleic acid purity measurement."
    },

    {
        name: "RCF",
        formula:
            "RCF = 1.118 × 10⁻⁵ × r × RPM²",
        description:
            "Calculates relative centrifugal force."
    }
];


function displayFormulaLibrary(list = formulas) {

    const container =
        document.getElementById("formulaLibrary");

    if (!container) return;

    if (list.length === 0) {

        container.innerHTML =
            "<p>No matching formulas found.</p>";

        return;
    }

    container.innerHTML =
        list.map(function(item) {

            return `
                <div class="formula-card">

                    <h3>${item.name}</h3>

                    <p>
                        <strong>${item.formula}</strong>
                    </p>

                    <p>
                        ${item.description}
                    </p>

                </div>
            `;

        }).join("");
}


function searchFormulas() {

    const input =
        document.getElementById("formulaSearch");

    if (!input) return;

    const query =
        input.value.toLowerCase().trim();

    if (!query) {

        displayFormulaLibrary(formulas);
        return;
    }

    const results =
        formulas.filter(function(item) {

            return (
                item.name
                    .toLowerCase()
                    .includes(query) ||

                item.formula
                    .toLowerCase()
                    .includes(query) ||

                item.description
                    .toLowerCase()
                    .includes(query)
            );

        });

    displayFormulaLibrary(results);
}


/* =========================================================
   28. BIOCHEMISTRY SEARCH
   ========================================================= */

const biochemistryData = [

    {
        title: "Glycolysis",
        text:
            "Glycolysis is the pathway that converts glucose into pyruvate and produces ATP and NADH."
    },

    {
        title: "Krebs Cycle",
        text:
            "The citric acid cycle oxidizes acetyl-CoA and produces NADH, FADH2 and GTP."
    },

    {
        title: "Protein Structure",
        text:
            "Protein structure includes primary, secondary, tertiary and quaternary levels."
    },

    {
        title: "Enzyme",
        text:
            "Enzymes are biological catalysts that increase reaction rates by lowering activation energy."
    },

    {
        title: "DNA Replication",
        text:
            "DNA replication produces a new DNA molecule using an existing DNA strand as a template."
    },

    {
        title: "Transcription",
        text:
            "Transcription is the synthesis of RNA from a DNA template."
    },

    {
        title: "Translation",
        text:
            "Translation is the synthesis of proteins using information carried by mRNA."
    },

    {
        title: "Beta Oxidation",
        text:
            "Beta oxidation breaks fatty acids into acetyl-CoA units."
    },

    {
        title: "Oxidative Phosphorylation",
        text:
            "Oxidative phosphorylation produces ATP through the electron transport chain and chemiosmosis."
    },

    {
        title: "Gluconeogenesis",
        text:
            "Gluconeogenesis produces glucose from non-carbohydrate precursors."
    },

    {
        title: "Urea Cycle",
        text:
            "The urea cycle converts toxic ammonia into urea for excretion."
    }
];


function searchBiochemistry() {

    const input =
        document.getElementById("bioSearch");

    const results =
        document.getElementById("searchResults");

    if (!input || !results) return;

    const query =
        input.value.toLowerCase().trim();

    if (!query) {

        results.innerHTML =
            "<p>Enter a biochemistry topic to search.</p>";

        return;
    }

    const matches =
        biochemistryData.filter(function(item) {

            return (
                item.title
                    .toLowerCase()
                    .includes(query) ||

                item.text
                    .toLowerCase()
                    .includes(query)
            );

        });

    if (matches.length === 0) {

        results.innerHTML =
            "<p>No matching topic found.</p>";

        return;
    }

    results.innerHTML =
        matches.map(function(item) {

            return `
                <div class="search-card">

                    <h3>${item.title}</h3>

                    <p>${item.text}</p>

                </div>
            `;

        }).join("");
}


/* =========================================================
   29. BIOCHEMISTRY TOPICS
   ========================================================= */

const topics = {

    carbohydrate: {
        title: "🍞 Carbohydrate Biochemistry",
        text:
            "Study monosaccharides, disaccharides and polysaccharides, including glycolysis, glycogenesis, glycogenolysis and gluconeogenesis."
    },

    proteinTopic: {
        title: "🥩 Protein Biochemistry",
        text:
            "Learn amino acids, peptide bonds, protein structure, folding, denaturation and protein purification."
    },

    lipid: {
        title: "🧈 Lipid Biochemistry",
        text:
            "Study fatty acids, triglycerides, phospholipids, cholesterol, beta oxidation, lipogenesis and ketone bodies."
    },

    nucleic: {
        title: "🧬 Nucleic Acids",
        text:
            "Learn DNA and RNA structure, nucleotide metabolism, replication, transcription and translation."
    },

    bioenergetics: {
        title: "⚡ Bioenergetics",
        text:
            "Study energy production, ATP, electron transport, proton gradients and oxidative phosphorylation."
    },

    enzymology: {
        title: "🧪 Enzymology",
        text:
            "Learn enzyme kinetics, inhibition, cofactors, coenzymes, catalytic mechanisms and enzyme regulation."
    },

    metabolism: {
        title: "🔥 Metabolism",
        text:
            "Study integrated carbohydrate, lipid, amino acid and energy metabolism."
    },

    clinical: {
        title: "🩸 Clinical Biochemistry",
        text:
            "Study biochemical markers used in diagnosis and monitoring of diseases."
    },

    molecular: {
        title: "🧬 Molecular Biology",
        text:
            "Learn DNA replication, transcription, RNA processing, translation and gene regulation."
    },

    immunochemistry: {
        title: "🛡️ Immunochemistry",
        text:
            "Study antibodies, antigens, immune reactions and biochemical methods used in immunology."
    },

    hormones: {
        title: "🧪 Hormones & Signaling",
        text:
            "Learn hormones, receptors, second messengers and cellular signal transduction."
    },

    vitamins: {
        title: "💊 Vitamins & Minerals",
        text:
            "Study the biochemical functions, sources, deficiencies and metabolism of vitamins and minerals."
    },

    membrane: {
        title: "🧫 Membrane Biochemistry",
        text:
            "Learn membrane structure, transport, membrane proteins and lipid organization."
    },

    genetics: {
        title: "🧬 Genetics",
        text:
            "Study genes, chromosomes, inheritance, mutations and genetic variation."
    },

    biotechnology: {
        title: "🔬 Biotechnology",
        text:
            "Learn how biological systems are used in laboratory research, medicine, agriculture and industry."
    }
};


/* =========================================================
   SHOW BIOCHEMISTRY TOPIC
   ========================================================= */

function showTopic(topicId) {

    const topic =
        topics[topicId];

    if (!topic) {

        console.error(
            "Topic not found:",
            topicId
        );

        return;
    }

    const title =
        document.getElementById("topicTitle");

    const text =
        document.getElementById("topicText");

    const content =
        document.getElementById("topicContent");

    /* Make sure Topics section is visible */
    const topicsSection =
        document.getElementById("topics");

    if (topicsSection) {

        document
            .querySelectorAll(".section")
            .forEach(function(item) {

                item.classList.remove("active");
                item.style.display = "none";

            });

        topicsSection.classList.add("active");
        topicsSection.style.display = "block";
    }

    if (title) {
        title.innerHTML = topic.title;
    }

    if (text) {
        text.innerHTML = topic.text;
    }

    if (content) {
        content.style.display = "block";
        content.style.visibility = "visible";
    }

    closeMenu();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    console.log(
        "Opened topic:",
        topicId
    );
}


/* =========================================================
   30. QUIZ
   ========================================================= */

const quizQuestions = [

    {
        question:
            "What is the main product of glycolysis?",

        options: [
            "Pyruvate",
            "Urea",
            "Fatty acid",
            "DNA"
        ],

        answer: 0
    },

    {
        question:
            "Which molecule is the main energy currency of the cell?",

        options: [
            "DNA",
            "ATP",
            "RNA",
            "Glucose"
        ],

        answer: 1
    },

    {
        question:
            "Which base is found in DNA but not normally in RNA?",

        options: [
            "Adenine",
            "Guanine",
            "Thymine",
            "Cytosine"
        ],

        answer: 2
    },

    {
        question:
            "What does an enzyme do?",

        options: [
            "Raises activation energy",
            "Lowers activation energy",
            "Destroys DNA",
            "Stops all reactions"
        ],

        answer: 1
    },

    {
        question:
            "Which organelle is mainly responsible for oxidative phosphorylation?",

        options: [
            "Nucleus",
            "Ribosome",
            "Mitochondrion",
            "Lysosome"
        ],

        answer: 2
    },

    {
        question:
            "What is the approximate normal A260/A280 ratio for pure DNA?",

        options: [
            "0.5",
            "1.0",
            "1.8",
            "3.5"
        ],

        answer: 2
    }
];


let currentQuestion = 0;
let quizScore = 0;


function loadQuizQuestion() {

    const question =
        document.getElementById("quizQuestion");

    const options =
        document.getElementById("quizOptions");

    const score =
        document.getElementById("quizScore");

    if (!question || !options) return;

    if (
        currentQuestion >=
        quizQuestions.length
    ) {

        question.innerHTML =
            "🎉 Quiz completed!";

        options.innerHTML =
            `<strong>Your score: ${quizScore}/${quizQuestions.length}</strong>`;

        if (score) {

            score.innerHTML =
                `Final Score: ${quizScore}/${quizQuestions.length}`;
        }

        return;
    }

    const q =
        quizQuestions[currentQuestion];

    question.innerHTML =
        `${currentQuestion + 1}. ${q.question}`;

    options.innerHTML =
        q.options.map(function(
            option,
            index
        ) {

            return `
                <button
                    class="quiz-option"
                    onclick="selectAnswer(${index})">
                    ${option}
                </button>
            `;

        }).join("");

    if (score) {

        score.innerHTML =
            `Score: ${quizScore}`;
    }
}


function selectAnswer(selected) {

    if (
        currentQuestion >=
        quizQuestions.length
    ) {
        return;
    }

    const question =
        quizQuestions[currentQuestion];

    if (
        selected === question.answer
    ) {

        quizScore++;

        alert("✅ Correct!");

    } else {

        alert(
            `❌ Incorrect. Correct answer: ${question.options[question.answer]}`
        );
    }

    currentQuestion++;

    loadQuizQuestion();
}


function nextQuestion() {

    if (
        currentQuestion <
        quizQuestions.length
    ) {

        currentQuestion++;

        loadQuizQuestion();
    }
}


/* =========================================================
   31. CONTACT FORM
   ========================================================= */

function handleContactForm(event) {

    event.preventDefault();

    alert(
        "Thank you for contacting BioChem Lab Hub."
    );
}


/* =========================================================
   32. INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        /* Close menu when page loads */
        closeMenu();

        /* Show Home */
        showSection("home");

        /* Formula library */
        displayFormulaLibrary();

        /* Quiz */
        loadQuizQuestion();

        /* Current year */
        const year =
            document.getElementById(
                "currentYear"
            );

        if (year) {

            year.textContent =
                new Date().getFullYear();
        }

        /* Correct overlay ID */
        const overlay =
            document.getElementById(
                "menuOverlay"
            );

        if (overlay) {

            overlay.addEventListener(
                "click",
                closeMenu
            );
        }

        console.log(
            "🧪 BioChem Lab Hub loaded successfully."
        );
    }
);
