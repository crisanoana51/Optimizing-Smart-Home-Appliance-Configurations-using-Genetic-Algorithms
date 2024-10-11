package licenta.retrievedata.controllers;


import licenta.retrievedata.entitites.Device;
import licenta.retrievedata.entitites.Solution;
import licenta.retrievedata.repositories.DeviceRepository;
import licenta.retrievedata.services.SolutionService;

import licenta.retrievedata.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/solutions")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SolutionController {

    @Autowired
    private SolutionService solutionService;

    @Autowired
    private UserService userService;

    @Autowired
    private DeviceRepository deviceRepository;

    @PostMapping("/{userId}")
    public ResponseEntity<Void> saveSolutions(@RequestBody List<Long> deviceIds,
                                             @PathVariable Long userId) {
        try {
            List<Device> solution = new ArrayList<>();
            for (Long id : deviceIds) {
                Device existingDevice = deviceRepository.findById(id)
                            .orElseThrow(() -> new RuntimeException("Device not found: " + id));
                solution.add(existingDevice);

                }

            Solution finalSolution = new Solution();

            finalSolution.setUserId(userId);
            finalSolution.setDevices(solution);

            solutionService.savePreferredSolution(finalSolution, userId);

            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity getSavedSolutions(@PathVariable Long userId){
        List<Solution> solutions = solutionService.getSolutionsByClientId(userId);
        if (solutions.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(solutions);
    }

    @GetMapping("/devices-sorted")
    public List<SolutionService.DeviceCount> getDevicesSortedByOccurrences() {
        return solutionService.getDevicesSortedByOccurrences();
    }

}
